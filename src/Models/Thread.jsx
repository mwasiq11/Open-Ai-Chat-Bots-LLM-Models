import React, { useState } from "react";
const Api_key = import.meta.env.VITE_OPENAI_KEY;
const assistant_id = import.meta.env.VITE_ASSISSTENT_Id;

function Thread() {
  const [data, setData] = useState("");
  const [response, setResponse] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState();

  const callOpenAiApi = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Create thread if not exists
      let thread_id = threadId;
      if (!thread_id) {
        const threadResponse = await fetch("https://api.openai.com/v1/threads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Api_key}`,
            "OpenAI-Beta": "assistants=v2",
          },
        });
        const thread = await threadResponse.json();
        thread_id = thread.id;
        setThreadId(thread_id);
      }

      // Step 2: Create a message
      await fetch(`https://api.openai.com/v1/threads/${thread_id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Api_key}`,
          "OpenAI-Beta": "assistants=v2",
        },
        body: JSON.stringify({
          role: "user",
          content: data,
        }),
      });

      // Step 3: Run assistant
      const runResponse = await fetch(
        `https://api.openai.com/v1/threads/${thread_id}/runs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Api_key}`,
            "Content-Type": "application/json",
            "OpenAI-Beta": "assistants=v2",
          },
          body: JSON.stringify({
            assistant_id: assistant_id,
          }),
        }
      );
      const run = await runResponse.json();
      const run_id = run.id;

      // Step 4: Wait for completion
      let runStatus = "in_progress";
      while (runStatus !== "completed") {
        const checkRun = await fetch(
          `https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${Api_key}`,
              "OpenAI-Beta": "assistants=v2",
            },
          }
        );
        const statusData = await checkRun.json();
        runStatus = statusData.status;
        await new Promise((res) => setTimeout(res, 2000));
        if (runStatus==="completed")
          break
        if(
          runStatus==="cancelled"||
          runStatus==="failed"||
          runStatus==="expired"
        ) {
          throw new Error("Run failed or cancelled/expired.");
        }
      }

      // Step 5: Get messages and append
      const messageResponse = await fetch(
        `https://api.openai.com/v1/threads/${thread_id}/messages`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Api_key}`,
            "OpenAI-Beta": "assistants=v2",
          },
        }
      );
      const msgData = await messageResponse.json();
      setResponse( [...msgData.data].reverse()); 
      setData("");
    } catch (error) {
      console.error("Error in post request", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="APP">
      <h1 className="font-bold text-2xl text-center mt-[1rem]">Thread API</h1>
      <form onSubmit={callOpenAiApi}>
        <div>
          <textarea
            className="border-[3px] rounded-[1rem] placeholder:text-center mt-[1rem]"
            style={{ margin: "2rem", marginLeft: "5rem" }}
            placeholder="Enter your Prompt..."
            value={data}
            onChange={(e) => setData(e.target.value)}
            rows={7}
            cols={40}
          />
        </div>
        <button className="ml-48" type="submit" disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>

      <br />

      <textarea
        className="border-[3px] rounded-[1rem] ml-[4rem]"
        readOnly
        value={response
          .map(
            (msg) => `${msg.role.toUpperCase()}: ${msg.content[0].text.value}`
          )
          .join("\n\n")}
        rows={15}
        cols={50}
      />
    </div>
  );
}

export default Thread;

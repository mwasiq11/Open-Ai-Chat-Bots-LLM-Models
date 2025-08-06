import { useState } from "react";

const Api_key =
  "place your api";
 const assistants_Id = "place your assisstent id";

function Thread() {
  const [data, setData] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const callOpenAiApi = async (e) => {  
    e.preventDefault();
    setLoading(true);
    setResponse("");
    try {
      // Step 1: create a thread
      const response = await fetch("https://api.openai.com/v1/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Api_key}`,
          "OpenAI-Beta": "assistants=v2",
        },
      });
      const thread = await response.json();
      const thread_id = thread.id;
      // Step 2: create a message
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
      const runAssisstent = await fetch(
        `https://api.openai.com/v1/threads/${thread_id}/runs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Api_key}`,
            "Content-Type": "application/json",
            "OpenAI-Beta": "assistants=v2",
          },
          body: JSON.stringify({
            "assistant_id": `${assistants_Id}`,
          }),
        }
      );
      console.log("assistent id is:",assistants_Id)
      
      const run = await runAssisstent.json();
      const runId = run.id;

      // Step 4: run untill its completed
      let runStatus = "in_progress";
      while (runStatus !== "completed") {
        const checkRun = await fetch(
          `https://api.openai.com/v1/threads/${thread_id}/runs/${runId}`,
          {
              headers: {
              Authorization: `Bearer ${Api_key}`,
              "OpenAI-Beta": "assistants=v2",
            },
          }
        );
        const statusData = await checkRun.json();
        runStatus = statusData.status;
        await new Promise((res) => setTimeout(res, 3000));
        if (runStatus === "completed")
          break;
        if (runStatus === "failed",runStatus === "cancelled" || runStatus === "expired")
          throw new Error("Run failed or cancelled/expired.");
      }

      // Step 5: Get messages
      const messageResponse = await fetch(
        `https://api.openai.com/v1/threads/${thread_id}/messages`,
        {   method:"GET",
            headers: {
            Authorization: `Bearer ${Api_key}`,
            "OpenAI-Beta": "assistants=v2",
          },
        }
      );
      const outputData = await messageResponse.json();
      setResponse(outputData.data[0].content[0].text.value);
    } catch (error) {
      console.log("Error in post request", error);
      return error;
    }
  };
  console.log(data);
  return (
    <div className="APP">
      <h1 className="font-bold text-2xl text-center mt-[1rem]">Thread API</h1>
      <form onSubmit={callOpenAiApi}>
        <div>
          <textarea
            className=" border-b-stone-100 border-[3px] rounded-[1rem] placeholder:text-center mt-[1rem]"
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
        className="border-b-stone-100 border-[3px] rounded-[1rem] ml-[4rem] "
        readOnly
        value={response}
        rows={15}
        cols={50}
      />
    </div>
  );
}

export default Thread;

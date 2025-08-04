import  { useState } from "react";
const Api_key =
 "place api";

function Thread() {
  const [data, setData] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const callOpenAiApi = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");
    try {
      const response = await fetch("https://api.openai.com/v1/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Api_key}`,
          "OpenAI-Beta": "assistants=v2",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: "Hello, what is AI?",
            },
            {
              role: "user",
              content: data,
            },
          ],
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error status ${response.status} message:${
            errorData.messages || "Unknow error"
          }`
        );
      }
      const responseData=await response.json()
      console.log("Open ai response",responseData)
      setResponse(responseData.content[0].text.value)
    } catch (error) {
      console.log("Error in post request", error);
      return error;
    }
  };
  console.log(data)
  return (
    <div className="APP">
        <h1 className="font-bold text-2xl text-center mt-[1rem]">Thread API</h1>
      <form type="submit">
        <div>
          <textarea className=" border-b-stone-100 border-[3px] rounded-[1rem] placeholder:text-center mt-[1rem]" 
          style={{margin:"2rem", marginLeft:"5rem"}}
          placeholder="Enter your Prompt..."
          value={data}
          onChange={(e)=>setData(e.target.value)}
          rows={7}
          cols={40}
           />
        </div>
        <button className="ml-48" type="submit" disabled={loading} onClick={callOpenAiApi}>
            {loading? "Loading...":"Submit"}
        </button>
      </form>
      <br />

      <textarea className="border-b-stone-100 border-[3px] rounded-[1rem] ml-[4rem] "
      readOnly
      value={response}
      rows={15}
      cols={50}/>
    </div>
  );
}

export default Thread;





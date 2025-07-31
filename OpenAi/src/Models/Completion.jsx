import React, { useState } from "react";
const Api_key =
  "Place your API";

function Completion() {
  const [joke, setJoke] = useState("");
  const [response, setResponse] = useState("");
  const [loading,setLoading]=useState(false)
  const callOpenAiApi = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResponse("")

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Api_key}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages:[
            {
                role:"system",
                content:"You are a helpful assistant."
            },
            {
                role:"user",
                content:joke
            }

          ]
        }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${
              errorData.message || "Unknown error"
            }`
          );
        }
      const responseData = await response.json();
      console.log("openai response", responseData);
      setResponse(responseData.choices[0].message.content);
    } catch (error) {
      console.error("Error in the Post request", error);
      return error;
    }
  };
  console.log(joke);
  return (
    <div className="App">
        <form type="submit">
      <div>
        <textarea  
        style={{margin:"2rem"}}
        value={joke}
          placeholder="Enter your prompt..."
          onChange={(e) => setJoke(e.target.value)}
          rows={7}
          cols={40}
        />
      </div>
      <button type="submit" disabled={loading} style={{marginLeft:"4rem"}} onClick={callOpenAiApi}>
      {loading?"Loading...":"Submit"}
      </button >
      </form>
      <br />

      <textarea
      readOnly
      style={{marginLeft:"0.5rem"}}
      value={response}
       cols={50}
       rows={15}/>
    </div>
  );
}

export default Completion;

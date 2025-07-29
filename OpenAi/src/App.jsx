import { useState } from "react";
import "./App.css";
const Api_key =
  "place your api";

function App() {
  const [story, setStory] = useState("");
  const [sentiment, setSentiment] = useState("");

    async function callOpenAiApi() {
      try {
        const response = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Api_key}`,
          },
          body: JSON.stringify({
            model: "gpt-4.1",
            input: "Tell me a three Sentence bedtime Story about a Unicorn.",
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
        return responseData;
      } catch (error) {
        console.error("Error during POST request:", error);
        throw error;
      }
    }
    console.log(story);


  return (
    <div className="App">
      <div>
        <textarea
          onChange={(e) => setStory(e.target.value)}
          placeholder="Get the Story from Open Ai"
          rows={10}
          cols={50}
        />
      </div>
      <button onClick={callOpenAiApi}>Tell me the Story</button>
      {sentiment ? <h3>The Story is: {sentiment}</h3> : null}
    </div>
  );
}
export default App;

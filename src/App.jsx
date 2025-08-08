import React from "react";
import Response from "./Models/Response";
import Completion from "./Models/Completion";
import Thread from "./Models/Thread";

function App() {
  return (
    <div className="flex">
      <Completion />
      <Response />
      <Thread/>
    </div>
  );
}

export default App;

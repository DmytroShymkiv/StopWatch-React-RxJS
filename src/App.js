import React from "react";
import StopWatch from "./StopWatch";
import StopWatchProvider from "./StopWatchContext";

function App() {
  return (
    <StopWatchProvider>
      <StopWatch />
    </StopWatchProvider>
  );
}

export default App;

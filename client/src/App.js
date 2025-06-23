import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GroupChat from "./pages/GroupChat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/group/:code" element={<GroupChat />} />
      </Routes>
    </Router>
  );
}

export default App;
// This code sets up a simple React application with React Router.
// It defines two routes: the home page ("/") and a group chat page ("/group/:code").
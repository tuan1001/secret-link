import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateSecret from "./pages/CreateSecret";
import ViewSecret from "./pages/ViewSecret";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateSecret />} />
        <Route path="/view/:token" element={<ViewSecret />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

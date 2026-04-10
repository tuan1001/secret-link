import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateSecret from "./pages/CreateSecret";
import ViewSecret from "./pages/ViewSecret";

const App: React.FC = () => {
  const basename = import.meta.env.BASE_URL.replace(/\/+$/, "") || "/";
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<CreateSecret />} />
        <Route path="/view/:token" element={<ViewSecret />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

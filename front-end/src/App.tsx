import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Project from "./pages/Project";
import Users from "./pages/Users";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <BrowserRouter>
      <div className="wrapper-content">
        <Sidebar />
        <div className="">
          <Routes>
            <Route path="/" element={<Navigate to="/projects" />} />
            <Route path="/projects" element={<Project />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

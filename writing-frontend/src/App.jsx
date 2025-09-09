import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/register";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import EditWriting from "./pages/EditWriting";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit/:id" element={<EditWriting />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

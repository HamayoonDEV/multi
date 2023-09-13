import "./App.module.css";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import Signup from "./components/SignUp/Signup";
import Home from "./components/Home/Home";
import Crypto from "./components/Crypto/Crypto";
import Blog from "./components/Blog/Blog";
function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="login" exact element={<Login />} />
        <Route path="signup" exact element={<Signup />} />
        <Route path="/" exact element={<Home />} />
        <Route path="crypto" exact element={<Crypto />} />
        <Route path="blog" exact element={<Blog />} />
      </Routes>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Adminlogin from "./pages/Adminlogin";
import Adminregister from "./pages/Adminregister";
import Course from "./pages/Course";
import Catpage from "./pages/Catpage";
import Error from "./pages/Error";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Uploadcourse from "./pages/Uploadcourse";
import Axios from "axios";

export const App = () => {
  // const [data, setdata] = useState("");
  // const getData = async () => {
  //   const response = await Axios.get("http://localhost:3001/getData");
  //   setdata(response.data);
  // };
  // useEffect(() => {
  //   getData();
  // }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/adminlogin" element={<Adminlogin />} />
          <Route path="/adminregister" element={<Adminregister />} />
          <Route path="/course" element={<Course />} />
          <Route path="/category/*" element={<Catpage />} />
          <Route path="/error" element={<Error />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/uploadcourse" element={<Uploadcourse />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

import React from "react";
import Ournavbar from "../components/Ournavbar";
import Registerform from "../components/Registerform";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

const Register = () => {
  const history = useNavigate();
  const getdata = async (username, password, name) => {
    console.log("This data is comming", username, password, name);
    try {
      const response = await Axios.post("http://localhost:3001/register", {
        username: username,
        password: password,
        name: name,
      }).then((res) => {
        if (res.data === "OK") {
          history("/");
        }
      });
      console.log("Login response:", response.data);
    } catch (error) {
      console.error("Error sending login request:", error);
    }
  };
  return (
    <div>
      <Ournavbar />
      <h1 className="admin-h1">Register as a Student</h1>
      <Registerform submit={getdata} />
    </div>
  );
};

export default Register;

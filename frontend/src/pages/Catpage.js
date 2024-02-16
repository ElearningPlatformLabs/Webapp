import React, { useState, useEffect } from "react";
import Axios from "axios";
import Footer from "../components/Footer";
import Ournavbar from "../components/Ournavbar";
import { useNavigate } from "react-router-dom";
import Coursepage from "../components/Coursepage";

const Catpage = (props) => {
  const [course, setcourse] = useState();
  const history = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/getuserinfo");
        console.log("user login info ", response.data);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
    fetchData();
  }, []);

  const url = window.location.href;
  const path = url.replace("http://localhost:3000/category/", "");
  const decodedPath = decodeURIComponent(path.replace("%20", " "));
  console.log("Path after removing prefix and %20:", decodedPath);

  useEffect(() => {
    const fetchD = async () => {
      try {
        const response = await Axios.post("http://localhost:3001/catpage", {
          path: decodedPath,
        }).then((res) => {
          if (res.data === "NOTOK") {
            history("/");
            alert("Kindly log in to access the course content");
          } else {
            setcourse(res.data.video);
          }
        });
      } catch (error) {
        console.error("Error sending login request:", error);
      }
    };
    fetchD();
  }, []);

  return (
    <div>
      <Ournavbar />
      <Coursepage videoarray={course} videotitle={decodedPath} />
      <Footer />
    </div>
  );
};

export default Catpage;

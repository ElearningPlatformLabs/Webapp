import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Ournavbar from "../components/Ournavbar";
import "../CSS/Home.css";
import Axios from "axios";
import Videocard from "../components/Videocard";

const Home = () => {
  const [course, setcourse] = useState("");
  const [typeOfUser_inserver, settypeOfUser_inserver] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/");
        console.log("user login info ", response.data);
        settypeOfUser_inserver(response.data.typeOfUser_inserver);
        setcourse(response.data.video);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Ournavbar typeOfUser_inserver={typeOfUser_inserver} />
      <div className="imagediv">
        <img className="mainimage" src={require("../images/education.svg")} />
      </div>
      <h2>Learning Unleashed Everywhere</h2>
      <Videocard videoarray={course} />
      <Footer />
    </div>
  );
};

export default Home;

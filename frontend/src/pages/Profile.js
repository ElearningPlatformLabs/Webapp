import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Ournavbar from "../components/Ournavbar";
import Axios from "axios";
import Videocard from "../components/Videocard";
import "../CSS/profile.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const history = useNavigate();
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [videoid, setvideoid] = useState([]);
  const [course, setcourse] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/getuserinfo");
        console.log("user login info ", response.data);
        setname(response.data.nameofuserthatloggedin);
        setemail(response.data.userThatLoggedin);
        setvideoid(response.data.videoArray);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
    fetchdata();
  }, []);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/");
        console.log("list of videos ", response.data);
        setcourse(response.data.video);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
    fetchdata();
  }, []);

  async function logoutfun() {
    try {
      const response = await Axios.post("http://localhost:3001/logout", {
        logout: true,
      }).then((res) => {
        if (res.data === "OK") {
          history("/");
        }
      });
    } catch (error) {
      console.error("Error sending login request:", error);
    }
    console.log("you ar about to log out");
  }

  useEffect(() => {
    const filteredVideosArray = course.filter((singlecourse) =>
      videoid.some((singlevideoid) => singlevideoid === singlecourse._id)
    );
    setFilteredVideos(filteredVideosArray);
  }, [course, videoid]);

  return (
    <div>
      <Ournavbar inprofile="yes" />
      <Row className="headerrow">
        <Col>
          <img className="profile_pic" src={require("../images/profile.svg")} />
        </Col>
        <Col xs={10}>
          <h1 className="name"> Hello {name}!</h1>
          <Button variant="danger" onClick={logoutfun}>
            Log out
          </Button>
        </Col>
      </Row>
      <h4 className="emailh4">
        <FontAwesomeIcon icon={faEnvelope} className="emailicon" />
        {email}
      </h4>
      {filteredVideos === undefined || filteredVideos.length == 0 ? (
        <h3 className="course_recommendation">
          You haven't contributed to e-learning yet
        </h3>
      ) : (
        <>
          <h3 className="course_recommendation">
            The courses you have uploaded to Elearning
          </h3>
          <Videocard videoarray={filteredVideos} />
        </>
      )}
      <Footer />
    </div>
  );
};

export default Profile;

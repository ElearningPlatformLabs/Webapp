import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Footer from "../components/Footer";
import Ournavbar from "../components/Ournavbar";
import "../CSS/uploadform.css";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const Uploadcourse = () => {
  const history = useNavigate();
  const [title, settitle] = useState("");
  const [createdby, setcreatedby] = useState("");
  const [discription, setdiscription] = useState("");
  const [keywords, setkeywords] = useState("");
  const [category, setcategory] = useState("");
  const [image, setimage] = useState("");
  const [video, setVideo] = useState(null);
  // const [i, seti] = useState(null);
  // const [v, setv] = useState(null);

  const Title_fun = (e) => settitle(e.target.value);
  const createdBy_fun = (e) => setcreatedby(e.target.value);
  const discription_fun = (e) => setdiscription(e.target.value);
  const keywords_fun = (e) => setkeywords(e.target.value);
  const category_fun = (e) => setcategory(e.target.value);
  const image_fun = (e) => setimage(e.target.files[0]);
  const video_fun = (e) => setVideo(e.target.files[0]);

  const upload = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("image", image);
    formdata.append("video", video);
    formdata.append("title", title);
    formdata.append("createdby", createdby);
    formdata.append("discription", discription);
    formdata.append("keywords", keywords);
    formdata.append("category", category);
    try {
      const response = await Axios.post(
        "http://localhost:3001/uploadcourse",
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ).then((res) => {
        if (res.data === "OK") {
          history("/");
        } else if (res.data === "adminlogin") {
          history("/adminlogin");
        } else {
          alert("Kindly register as teacher to upload course");
        }
      });
    } catch (error) {
      console.error("Error sending upload request:", error);
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await Axios.get("http://localhost:3001/getimage");
  //       seti(response.data[0].img);
  //       setv(response.data[0].videoPath);
  //     } catch (error) {
  //       console.error("Error fetching image:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);
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

  return (
    <div>
      <Ournavbar />
      <div className="uploadform">
        <h2>Upload your course details</h2>
        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            Title:
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            onChange={Title_fun}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            Created by:
          </InputGroup.Text>
          <Form.Control
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            onChange={createdBy_fun}
          />
        </InputGroup>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Discription:</Form.Label>
          <Form.Control as="textarea" rows={3} onChange={discription_fun} />
        </Form.Group>
        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            Keywords:
          </InputGroup.Text>
          <Form.Control
            onChange={keywords_fun}
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-default">
            Course category:
          </InputGroup.Text>
          <Form.Control
            onChange={category_fun}
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
          />
        </InputGroup>
        <div className="field padding-bottom--24">
          <input
            type="file"
            name="video"
            id="video"
            accept="video/*"
            onChange={video_fun}
          />
        </div>
        <div className="field padding-bottom--24">
          <input
            className="file"
            type="file"
            name="image"
            accept="image/*"
            onChange={image_fun}
          />
        </div>
        <input
          className="btn-sub"
          type="submit"
          value="Upload"
          onClick={upload}
        />
      </div>
      {/* <img className="image" src={`http://localhost:3001/uploads/` + i} />
      {v ? (
        <video width="320" height="240" controls loop autoPlay>
          <source src={`http://localhost:3001/uploads/` + v} type="video/mp4" />
        </video>
      ) : (
        <p>Loading video...</p>
      )} */}

      <Footer />
    </div>
  );
};

export default Uploadcourse;

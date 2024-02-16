import React from "react";
import "../CSS/videocard.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../CSS/coursepage.css";
import Videocard from "./Videocard";

function Coursepage(props) {
  if (!Array.isArray(props.videoarray)) {
    return <div>No videos available</div>;
  }
  const selectedVideo = props.videoarray.find(
    (video) => props.videotitle === video.title
  );

  const cat = selectedVideo.courseCat;
  const filteredVideos = props.videoarray.filter(
    (video) => video.courseCat == cat
  );

  return (
    <div>
      {props.videoarray.map((video) => (
        <div key={video._id}>
          {props.videotitle === video.title ? (
            <>
              <Row>
                <Col className="maincol detailcol">
                  <h2 className="title">{video.title}</h2>
                  <p className="cat">
                    {"> "}
                    {video.courseCat}
                  </p>
                  <h5 className="keywords">{video.keywords}</h5>
                  <p className="description">{video.description}</p>
                  <p className="createdby">created by: {video.createdBy}</p>
                </Col>
                <Col className="maincol">
                  <video width="640" height="360" controls>
                    <source
                      src={`http://localhost:3001/uploads/` + video.videoPath}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </Col>
              </Row>
            </>
          ) : null}
        </div>
      ))}
      <h2 className="recomendedcourse">Courses you might find similar</h2>
      <div className="listofsimilarcourses">
        <Videocard videoarray={filteredVideos} />
      </div>
    </div>
  );
}

export default Coursepage;

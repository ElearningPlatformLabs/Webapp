import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "../CSS/videocard.css";

function truncateText(text, maxLength) {
  const words = text.split(" ");
  if (words.length > maxLength) {
    return words.slice(0, maxLength).join(" ") + " ...";
  }
  return text;
}

function Videocard(props) {
  if (!Array.isArray(props.videoarray)) {
    return <div>No videos available</div>;
  }

  // Group videos by courseCat
  const groupedVideos = props.videoarray.reduce((grouped, video) => {
    const cat = video.courseCat || "Uncategorized";
    grouped[cat] = grouped[cat] || [];
    grouped[cat].push(video);
    return grouped;
  }, {});

  return (
    <div>
      {Object.entries(groupedVideos).map(([cat, videos]) => (
        <div key={cat}>
          <h2>{cat}</h2>
          <div className="card-container">
            {videos.map((video) => (
              <Card key={video._id}>
                <Card.Img
                  variant="top"
                  className="cardimage"
                  src={`http://localhost:3001/uploads/` + video.img}
                />
                <Card.Body>
                  <Card.Title>{video.title}</Card.Title>
                  <Card.Text>{truncateText(video.description, 10)}</Card.Text>
                  <Button
                    variant="outline-success"
                    href={"/category/" + video.title}>
                    Read more
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Videocard;

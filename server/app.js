//jshint esversion:6
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const findOrCreate = require("mongoose-findorcreate");
const cors = require("cors");
const { log } = require("console");
const bodyParser = require("body-parser");
const { create } = require("domain");

var username_inserver = "";
var typeOfUser_inserver = "";

const app = express();
app.use(express.static(__dirname + "/public"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "Our secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://0.0.0.0:27017/elearnDB", {});

/////////////////////////multer///////////////////

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

////////////////////////////Schema//////////////////////////////

const userSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    unique: true,
  },
  password: String,
  typeOfUser: String,
  videoId: [String],
  CreatedVideoId: [String],
});

const videoSchema = new mongoose.Schema({
  title: String,
  videoPath: String,
  description: String,
  courseCat: String,
  keywords: String,
  createdBy: String,
  img: String,
});

//////////////////////////////////////////////////////////////////
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

//////////////////////////model//////////////////////////////////
const User = new mongoose.model("User", userSchema);
const Video = new mongoose.model("Video", videoSchema);

/////////////////////////passport///////////////////////////////

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

////////////////////////////////////get////////////////////////////////

app.get("/", async (req, res) => {
  try {
    const [video, username] = await Promise.all([Video.find(), User.find()]);
    if (video) {
      res.json({ video: video, typeOfUser_inserver: typeOfUser_inserver });
    } else {
      res.send("Video not found");
    }
  } catch (error) {
    res.send("Error fetching video");
  }
});

app.get("/getuserinfo", async (req, res) => {
  var userinfo = {};
  const [video, username] = await Promise.all([Video.find(), User.find()]);
  username.forEach((user) => {
    if (user.username === username_inserver) {
      userinfo = {
        userThatLoggedin: username_inserver,
        typeOfUser_userThatLoggedin: typeOfUser_inserver,
        nameofuserthatloggedin: user.name,
        videoArray: user.CreatedVideoId,
      };
    }
  });

  res.json(userinfo);
});

////////////////////////////////////post//////////////////////////////

app.post("/login", async function (req, res) {
  const { username, password } = req.body;
  const user = new User({
    username: username,
    password: password,
    typeOfUser: "user",
  });
  req.login(user, async function (err) {
    if (err) {
      res.json("NOTOK");
    } else {
      passport.authenticate("local")(req, res, async function () {
        try {
          const docs = await User.find({
            typeOfUser: "user",
            username: username,
          });
          if (docs.length !== 0) {
            res.json("OK");
            username_inserver = username;
            typeOfUser_inserver = "user";
          } else {
            console.log("you are an admin");
            res.json("NOTOK");
          }
        } catch (err) {
          console.error(err);
        }
      });
    }
  });
});

app.post("/adminlogin", async function (req, res) {
  const { username, password } = req.body;
  const user = new User({
    username: username,
    password: password,
    typeOfUser: "admin",
  });
  req.login(user, async function (err) {
    if (err) {
      res.json("NOTOK");
    } else {
      passport.authenticate("local")(req, res, async function () {
        try {
          const docs = await User.find({
            typeOfUser: "admin",
            username: username,
          });

          if (docs.length !== 0) {
            res.json("OK");
            username_inserver = username;
            typeOfUser_inserver = "admin";
          } else {
            console.log("you are an user");
            res.json("NOTOK");
          }
        } catch (err) {
          console.error(err);
        }
      });
    }
  });
});

app.post("/register", function (req, res) {
  const { username, password, name } = req.body;
  User.register(
    new User({
      username: username,
      name: name,
      typeOfUser: "user",
    }),
    password,
    function (err, user) {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function () {});
        res.json("OK");
        username_inserver = username;
        typeOfUser_inserver = "user";
      }
    }
  );
});

app.post("/adminregister", function (req, res) {
  const { username, password, name } = req.body;
  User.register(
    new User({
      username: username,
      name: name,
      typeOfUser: "admin",
    }),
    password,
    async function (err, user) {
      if (err) {
        console.log(err);
        return res.json("NOTOK");
      }
      await passport.authenticate("local")(req, res, function () {});
      res.json("OK");
      username_inserver = username;
      typeOfUser_inserver = "admin";
    }
  );
});

app.post(
  "/uploadcourse",
  upload.fields([{ name: "image" }, { name: "video" }]),
  async (req, res) => {
    if (username_inserver === "" || typeOfUser_inserver === "user") {
      res.json("NOTOK");
    } else {
      const { title, createdby, discription, keywords, category } = req.body;
      const lowerCaseCategory = category.toLowerCase();
      if (username_inserver != "") {
        if (typeOfUser_inserver == "admin") {
          try {
            const video = new Video({
              title: title,
              description: discription,
              courseCat: lowerCaseCategory,
              keywords: keywords,
              createdBy: createdby,
              img: req.files["image"][0].filename,
              videoPath: req.files["video"][0].filename,
            });
            await video.save();
            const videoid = video._id.toString();
            const [user_s] = await Promise.all([User.find()]);
            user_s.forEach(async (user) => {
              if (user.username === username_inserver) {
                await User.updateOne(
                  { username: username_inserver },
                  { $push: { CreatedVideoId: videoid } }
                );
              }
            });
            res.json("OK");
          } catch (error) {
            console.error("Error saving to MongoDB:", error);
            res.status(400).send(error);
          }
        } else {
          res.json("adminlogin");
          console.log("adminlogin");
        }
      } else {
        res.json("adminlogin");
        console.log("not at all login");
      }
    }
  }
);

app.post("/catpage", async (req, res) => {
  const course_title = req.body.path;
  if (username_inserver === "") {
    res.json("NOTOK");
  } else {
    try {
      const [video, username] = await Promise.all([Video.find(), User.find()]);
      if (video) {
        res.json({ video: video, typeOfUser_inserver: typeOfUser_inserver });
      } else {
        res.send("Video not found");
      }
    } catch (error) {
      res.send("Error fetching video");
    }
  }
});

app.post("/logout", async (req, res) => {
  if (req.body.logout === true) {
    try {
      username_inserver = "";
      typeOfUser_inserver = "";
      res.json("OK");
    } catch (error) {
      console.error("Error in asynchronous operation:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

/////////////////////////////listen/////////////////////////////////

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}

app.listen(port, function () {
  console.log("in port 3001");
});

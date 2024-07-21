const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const path = require("path");
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const users = require("./routes/user");
const reviews = require("./routes/review");
const auth = require("./routes/auth");
const morgan = require("morgan");
const colors = require("colors");
const cookieParse = require("cookie-parser");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

const app = express();
app.use(express.json());
app.use(cookieParse());

connectDB().then(r => console.log("Connected to database".cyan.underline.bold));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(fileUpload());
app.use(express.static(path.join(__dirname, "public")));


app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Listening on port ${process.env.NODE_ENV} mode on port ${PORT} `.yellow
      .bold
  );
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error ${err.message.red}`);
  server.close(() => {
    process.exit(1);
  });
});

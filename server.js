const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const bootcamps = require("./routes/bootcamps");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

const app = express();
app.use(express.json());
connectDB();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/api/v1/bootcamps", bootcamps);
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

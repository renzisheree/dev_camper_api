const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

const Bootcamp = require("./models/Bootcamps");
mongoose.connect(process.env.MONGODB_URL, {});

const bootcamp = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const importData = async () => {
  try {
    await Bootcamp.create(bootcamp);
    console.log("Data imported...".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log("Data destroyed...".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}

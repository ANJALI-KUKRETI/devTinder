const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://anjali:Kalyannagar%40123@cluster0.khthiuh.mongodb.net/devTinder?retryWrites=true&w=majority&appName=Cluster0"
  );
};

module.exports = connectDB;

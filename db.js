const mongoose = require("mongoose");
const MONGOURI = "mongodb+srv://mainUser:Qwerty123@testcluster.dtrsa.mongodb.net/?retryWrites=true&w=majority";

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("The App is Connected to the DB!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;

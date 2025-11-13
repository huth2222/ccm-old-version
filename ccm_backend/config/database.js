const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
mongoose.connect(
  process.env.MONGO_HOST,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
).then((result) => {
  console.log('Connected to MongoDB database')
}).catch((err) => {
  console.log(err)
  console.log('Error connect to MongoDB database')
});
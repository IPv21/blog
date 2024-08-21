const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
const port = process .env.PORT || 3000
const mongoose = require('mongoose');

const bodyParser = require('body-parser');


// parse options
app.use(express.json());
app.use(cors());
// console.log(process.env)  

//routes
const blogRoutes = require('./src/routes/blog.route')
app.use('/api/blogs', blogRoutes)
app.use(bodyParser.json());

app.use('/blog', blogRoutes);


async function main() {
    await mongoose.connect(process.env.MONGODB_URL);

    app.get('/', (req, res) => {
        res.send('Server is runninggg!!!')
      })
  }



  main().then(() => console.log("<<<MongoDB Connected Successfully>>>")).catch(err => console.log(err));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
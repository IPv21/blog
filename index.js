const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

//routes
const blogRoutes = require('./src/routes/blog.route');
const commentRoutes = require('./src/routes/comment.route');
const userRoutes = require('./src/routes/auth.user.route');

//use routes 
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);


async function main() {
    await mongoose.connect(process.env.MONGODB_URL);
    app.get('/', (req, res) => {
        res.send('NOMAD is runninggg!!!');
    });
}

main().then(() => console.log("<<<MongoDB Connected Successfully>>>")).catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// 3:56 token validation
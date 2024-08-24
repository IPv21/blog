const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const blogRoutes = require('./src/routes/blog.route');
const commentRoutes = require('./src/routes/comment.route');

app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);

async function main() {
    await mongoose.connect(process.env.MONGODB_URL);
    app.get('/', (req, res) => {
        res.send('Server is runninggg!!!');
    });
}

main().then(() => console.log("<<<MongoDB Connected Successfully>>>")).catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

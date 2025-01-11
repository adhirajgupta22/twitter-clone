const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

const connectDB = require('./config/db.config');
const cookieParser = require('cookie-parser');

//importing routes
const authRoutes = require('./routes/auth.route');
const notificationRoutes = require('./routes/notification.route');
const userRoutes = require('./routes/user.route');
const postRoutes = require('./routes/post.route');

dotenv.config();  //helps in configuration of .env files variables
const app = express();
const port = process.env.PORT || 5000;
const _dirname = path.resolve();

app.use(express.json({limit: '5mb'}));  //helps in parsing req body;
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); //helps in parsing cookies attached to the HTTP request headers
//it makes cookies available as javascript object in req.cookies allowing us to access cookies easily

app.get('/', (req, res) => {
    res.send("home page of server");
});
app.use('/api/auth', authRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDB();
});
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Posts');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const multer = require('multer');
const uploadMiddleware = multer({ dest: '/temp' });

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const mime = require('mime-types');

require('dotenv').config();


const saltRounds = 10; // Number of salt rounds (adjust as needed)
const salt = bcrypt.genSaltSync(saltRounds);
const secret = 'awawaReact09DevAshu112awawa';

const bucket = 'my-mern-blog';


app.use(cors({
    credentials: true,
    origin: 'https://mern-blog-x.vercel.app',
}));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(__dirname + '/uploads'));

// const user = 'ashutoshyad3105';
// const pass = 'StartSwitch5@10Oct'; // complex password with symbol

// Construct the MongoDB connection string
// const connectionString = `mongodb+srv://${user}:${encodeURIComponent(pass)}@cluster0.x2hncxt.mongodb.net/?retryWrites=true&w=majority`;
// mongoose.connect(process.env.MONGO_URL);

// Use the MONGO_URL environment variable from the .env file
function mongooseConnection() {

    const connectionString = process.env.MONGO_URL;


    mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((error) => {
            console.error('MongoDB connection error:', error);
        });
}


async function uploadToS3(path, originalFileName, mimetype) {
    const client = new S3Client({
        region: 'ap-south-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
    });
    const parts = originalFileName.split('.');
    const ext = parts[parts.length - 1];
    const newFileName = Date.now() + '_' + ext;

    await client.send(new PutObjectCommand({
        Bucket: bucket,
        Body: fs.readFileSync(path),
        Key: newFileName,
        ContentType: mimetype,
        ACL: 'public-read',
    }));

    return `https://${bucket}.s3.amazonaws.com/${newFileName}`;
}


app.post('/register', async (req, res) => {
    mongooseConnection();

    const { userName, password } = req.body;
    try {
        const userDoc = await User.create({
            userName,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch (e) {
        console.log(e);
        res.status(400).json(e);
    }
});

app.post('/login', async (req, res) => {
    mongooseConnection();

    const { userName, password } = req.body;
    const userDoc = await User.findOne({ userName });
    if (userDoc) {

        const passOK = bcrypt.compareSync(password, userDoc.password);

        if (passOK) {
            // user logged in 
            jwt.sign({ userName, id: userDoc._id }, secret, { algorithm: 'HS256' }, (err, token) => {
                // algorithm: 'HS256'
                if (err) {

                    throw err;
                }
                res.cookie('token', token).json({
                    id: userDoc._id,
                    userName,
                });
                // res.json(token);
            });
            // res.json()
        }
        else {
            // user not logged in
            res.status(400).json('wrong password');
        }
    }
    else {
        res.status(400).json('user not found');
    }
});


app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});


app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    mongooseConnection()

    const newPath = [];
    let postDoc;
    const { originalname, path, mimetype } = req.file;
    const url = await uploadToS3(path, originalname, mimetype);
    newPath.push(url);


    const { token } = req.cookies;
    jwt.verify(token, secret, { algorithms: ['HS256'] }, async (err, info) => {
        // algorithms: ['HS256']
        if (err) throw err;

        const { title, summary, content } = req.body;

        postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath[0],
            author: info.id,
        });
    });

    res.json(postDoc);
});


app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    mongooseConnection();

    let newPath = null;
    if (req.file) {

        const newPath = [];
        const { originalname, path, mimetype } = req.file;
        const url = await uploadToS3(path, originalname, mimetype);
        newPath.push(url);
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, async (err, info) => {
        // algorithms: ['HS256']
        if (err) throw err;

        const { id, title, summary, content } = req.body;

        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json('you are not the author of the post');
        }

        await postDoc.updateOne({
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,

        });
        res.json(postDoc);
    });

})


app.get('/profile', (req, res) => {
    mongooseConnection();

    const { token } = req.cookies;
    jwt.verify(token, secret, { algorithms: ['HS256'] }, (err, info) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(401).json({ error: 'Token verification failed' });
        }
        console.log('Token verification successful. User info:', info);
        res.json(info);
    });
});


app.get('/post', async (req, res) => {
    mongooseConnection();

    const posts = await Post.find()
        .populate('author', ['userName'])
        .sort({ createdAt: -1 })
        .limit(20);
    console.log(posts);
    res.json(posts);

});

app.get('/post/:id', async (req, res) => {
    mongooseConnection();

    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['userName']);
    res.json(postDoc);
})

app.listen(4000);
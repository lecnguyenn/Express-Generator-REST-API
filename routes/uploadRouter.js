const express = require('express');
const bodyParse = require('body-parser');
const cors = require('./cors');
const multer = require('multer');
const authenticate = require('../authenticate');

const storage =  multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'public/images');
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});

const imageFileFilter = (req, file, cb) =>{
    if(!file.originalname.match(/\.(jpg|jpeg|gif|png)$/)){
        return cb(new Error('You can  upload only image files!'), false);
    }
    cb(null, true);
};

const upload  =  multer({storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();
uploadRouter.use(bodyParse.json());

uploadRouter.route('/')
.options(cors.corsWithOption, (req,res) => {req.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    res.statusCode = 403;
    res.end('GET not operation not supported on /imageUpload');
})
.post(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req,res)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file);
})
.put(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    res.statusCode = 403;
 })
.delete(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    res.statusCode = 403;
    res.end('DELETE not operation not supported on /image/Upload');
})


module.exports = uploadRouter;
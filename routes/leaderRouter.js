const express = require('express');
const bodyParse = require('body-parser');


const Leaders  = require('../models/leaders');
const authenticate = require('../authenticate');
const  cors = require('./cors');

const leaderRouter =  express.Router();
leaderRouter.use(bodyParse.json());

leaderRouter.route('/')
.options(cors.corsWithOption, (req,res) => {req.sendStatus(200); })
.get(cors.cors, (req,res,next)=>{
    Leaders.find(req.query)
        .then((leaders) =>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leaders);
        },(err) => next(err))
        .catch((err) => next(err));
})
.post(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) =>{
    Leaders.create(req.body)
        .then((leader) =>{
            console.log('Leader Created: ', leader);
            res.statusCode =200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        },(err) => next(err))
        .catch(err => next(err));
})
.put(cors.corsWithOption,authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) =>{
    res.end('PUT not operation not supported on /leaders');
})
.delete(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) =>{
    Leaders.remove({})
    .then((resp) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) =>next(err))
    .catch((err) => next(err));
});

leaderRouter.route('/:leaderId')
.options(cors.corsWithOption, (req,res) => {req.sendStatus(200); })
.get(cors.cors, (req,res,next) =>{
    Leaders.findById(req.params.leaderId)
    .then((leader) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin, (res,req,next) =>{
    res.statusCode = 403;
    res.end('POST operation not support on /leaders' + req.params.leaderId);
})
.put(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) =>{
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    },{new : true})
    .then((leader) =>{
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    },(err) => next(err))
    .catch((err) => next(err));    
})
.delete(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) =>{
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err));
})

module.exports = leaderRouter;

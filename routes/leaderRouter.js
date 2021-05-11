const express = require('express');
const bodyParse = require('body-parser');

const leaderRouter =  express.Router();
leaderRouter.use(bodyParse.json());

leaderRouter.route('/')
.all((req,res,next) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('Will send all the leaders for you ');
})
.post((req,res,next) =>{
    res.end('Will add the leaders: ' + req.body.name + ' with details: ' + req.body.description)
})
.put((req,res,next) =>{
    res.end('PUT not operation not supported on /leaders');
})
.delete((req,res,next) =>{
    res.end('Deleting all the leaders !');
});
leaderRouter.route('/:leaderId')
.all((req,res,next) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) =>{
    res.end('Will send details of the leaders ' + req.params.leaderId + ' to you');
})
.post((res,req,next) =>{
    res.statusCode = 403;
    res.end('POST operation not support on /leaders' + req.params.leaderId);
})
.put((req,res,next) =>{
    res.write('Updating the leaders: ' + req.params.leaderId);
    res.end('Will update the leadersf: ' + req.params.leaderId + ' with details: ' + req.params.leaderId );
})
.delete((req,res,next) =>{
    res.end('Deleting the leaders: ' + res.params.leaderId);
})

module.exports = leaderRouter;

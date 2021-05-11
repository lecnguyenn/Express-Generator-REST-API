const exprees = require('express');
const bodyParse = require('body-parser');

const promoRouter = exprees.Router();
promoRouter.use(bodyParse.json());

promoRouter.route('/')
.all((req,res,next) =>{
    res.statusCode= 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) =>{
    res.end('Will send all the promotions for you');
})
.post((req,res,next) =>{
    res.end('Will add the promtion: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req,res,next) =>{
    res.statusCode= 403;
    res.end('PUT not operation supported on /promotion');
})
.delete((req,res,next) =>{
    res.end('Deleting all the promotions');
});
promoRouter.route('/:promoId')
.all((req,res,next) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) =>{
    res.end('Will send details of the promotions: '  + req.params.promoId + 'to you');
})
.post((req,res,next) =>{
    res.statusCode = 200;
    res.end('Will operation not support on / promotions' + req.params.promoId);
})
.put((req,res,next) =>{
    res.write('Updating the promotion: ' + req.params.promoId);
    res.end('Will update the promotion ' + req.params.promoId + 'with details: ' + req.params.promoId);
})
.delete((req,res,next) =>{
    res.end('Deleting the promotions: ' + res.params.promoId);
})
module.exports = promoRouter;
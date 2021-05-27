const express = require('express');
const bodyParse = require('body-parser');

const cors = require('./cors');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Promotions = require('../models/promotions'); 
const promoRouter = express.Router();
promoRouter.use(bodyParse.json());

promoRouter.route('/')
.options(cors.corsWithOption, (req,res) => {req.sendStatus(200); })
.get(cors.cors, (req,res,next) =>{
    Promotions.find({})
            .then((promo) =>{
                res.statusCode =200;
                res.setHeader('Content-Type','application/json');
                res.json(promo)
            },(err) => next(err))
            .catch(err => next(err));
})
.post(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) =>{
    Promotions.create(req.body)
        .then((promo) =>{
            console.log('Promotions Created: ', promo);
            res.statusCode =200;
            res.setHeader('Content-Type','application/json');
            res.json(promo);
        },(err) => next(err))
        .catch(err => next(err));

})
.put(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) =>{
    res.statusCode= 403;
    res.end('PUT not operation supported on /promotion');
})
.delete(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) =>{
    Promotions.remove({})
    .then((resp) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err));
});
promoRouter.route('/:promoId')
.options(cors.corsWithOption, (req,res) => {req.sendStatus(200); })
.get(cors.cors, (req,res,next) =>{
   Promotions.findById(res.params.promoId)
   .then((promo) =>{
       res.statusCode =200;
       res.setHeader('Content-Type', 'application/json');
       res.json(promo);
   },(err) => next(err))
   .catch((err) => next(err));
})
.post(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) =>{
    res.statusCode = 200;
    res.end('Will operation not support on / promotions' + req.params.promoId);
})
.put(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) =>{
  Promotions.findByIdAndUpdate(req.params.promoId, {
      $set:req.body
  },{new: true})
  .then((promo) =>{
      res.statusCode =200;
      res.setHeader('Content-Type','application/json');
      res.json(err)
  },(err) => next(err))
  .catch((err) => next(err));
})
.delete(cors.corsWithOption, authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next) =>{
    Promotions.findByIdAndRemove(req.params.promoId)
        .then((resp) =>{
            res.statusCode =200;
            res.setHeader('Content-Type','application/json');
            res.json(resp);
        },(err) => next(err))
        .catch((err) => next(err));
})
module.exports = promoRouter;
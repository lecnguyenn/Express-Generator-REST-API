const express = require('express');
const bodyParse = require('body-parser');


const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Promotions = require('../models/promotions'); 
const promoRouter = express.Router();
promoRouter.use(bodyParse.json());

promoRouter.route('/')

.get((req,res,next) =>{
    Promotions.find({})
            .then((promo) =>{
                res.statusCode =200;
                res.setHeader('Content-Type','application/json');
                res.json(promo)
            },(err) => next(err))
            .catch(err => next(err));
})
.post(authenticate.verifyUser, (req,res,next) =>{
    Promotions.create(req.body)
        .then((promo) =>{
            console.log('Promotions Created: ', promo);
            res.statusCode =200;
            res.setHeader('Content-Type','application/json');
            res.json(promo);
        },(err) => next(err))
        .catch(err => next(err));

})
.put(authenticate.verifyUser, (req,res,next) =>{
    res.statusCode= 403;
    res.end('PUT not operation supported on /promotion');
})
.delete(authenticate.verifyUser, (req,res,next) =>{
    Promotions.remove({})
    .then((resp) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err));
});
promoRouter.route('/:promoId')

.get((req,res,next) =>{
   Promotions.findById(res.params.promoId)
   .then((promo) =>{
       res.statusCode =200;
       res.setHeader('Content-Type', 'application/json');
       res.json(promo);
   },(err) => next(err))
   .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req,res,next) =>{
    res.statusCode = 200;
    res.end('Will operation not support on / promotions' + req.params.promoId);
})
.put(authenticate.verifyUser, (req,res,next) =>{
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
.delete(authenticate.verifyUser, (req,res,next) =>{
    Promotions.findByIdAndRemove(req.params.promoId)
        .then((resp) =>{
            res.statusCode =200;
            res.setHeader('Content-Type','application/json');
            res.json(resp);
        },(err) => next(err))
        .catch((err) => next(err));
})
module.exports = promoRouter;
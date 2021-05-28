const express = require('express');
const bodyParse = require('body-parser');


const mongoose = require('mongoose');
const cors = require('./cors');
const Favorites = require('../models/favorite');
const favoriteRouter = express.Router();
const authenticate = require('../authenticate');
favoriteRouter.use(bodyParse.json());

favoriteRouter.route('/')
.options(cors.corsWithOption, (req, res) => { req.sendStatus(200);})
.get(cors.cors, (req,res,next) =>{
        Favorites.find({})
                .populate('user')
                .populate('dishes')
                .then((favorites) =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                },(err) => next(err))
                .catch(err => next(err));
})
.post(cors.corsWithOption, authenticate.verifyUser, (req, res, next) =>{
        Favorites.findOne({user: req.user._id})
                .populate('user')
                .populate('dishes')
                .then((favorite)  =>{
                    if(favorite == null){
                        Favorites.create()
                        .then((favorite)=>{
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            for(let i in req.body){
                                favourite.dishes.push(req.body[i]);
                            }
                            favourite.save()
                            res.json(favorite);
                        },(err) => next(err))
                        .catch(err => next(err));
                    }
                 })
                .catch(err => next(err))
})
.put(cors.corsWithOption, authenticate.verifyUser, (req, res, next) =>{
    res.statusCode =403; 
    res.end('PUT operation not supported on/ Favourite !');
})
.delete(cors.corsWithOption, authenticate.verifyUser, (req, res, next) =>{
    Favorites.remove({})
    .then((resp) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type',' application/json');
        res.json(resp);
    },(err) => next(err))
    .catch(err => next(err));
});
favoriteRouter.route('/:favoriteId')
.options(cors.corsWithOption, (req, res) => { req.sendStatus(200);})
.get(cors.cors, (req,res, next) =>{
        Favorites.findById(req.params.favoriteId)
        .then((favorite) =>{
            if(!favorite.user.equals(req.user._id)){
                var err = new Error('Only Creator can perform this');
                err.status = 401; 
                return next(err);
            }
           res.statusCode = 200;
           res.setHeader('Content-Type', 'application/json');
           res.json(favorite);
        })
        .catch((err) => next(err));
})
.post(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    Favorites.findById(req.params.favoriteId)
    .then((favorite) =>{
        if(favorite == null){
            let newFavorite = {};
            newFavorite.user = req.user._id;
            Favorite.create(newFavorite)
            .then((favorite) =>{
                console.log('Favorite Created ', newFavorite);
                favorite.dishes.push(req.params.favoriteId)
                favorite.save()
                    .then((favorite) =>{
                        Dishes.findById(favorite.id)
                        .then((favorite) =>{
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite)
                        })
                    },err => next(err));
            },err => next(err))
            .catch(err => next(err));
        }
        else{
            var err = new Error('Dish ' + req.params.dishId + ' already exis!');
            err.status = 404;
            return next(err);
        }
    })
})
.put(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    Favorites.findByIdAndUpdate(req.params.favoriteId, {
        $set: req.body
    }, {new: true})
    .then((favorite) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    },(err) => next(err))
    .catch(err => next(err));
})
.delete(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
    Favorites.findOne({})
    .then((favorite) =>{
        favorite.dishes.remove(req.params.favoriteId);
        favorite.save()
            .then((dish) =>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite)
            },err => next(err))
    })
    .catch(err => next(err));
});

module.exports = favoriteRouter;

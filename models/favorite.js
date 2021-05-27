const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);


const favoriteSchema = new Schema({
    posterBy: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
     dishes: [
         {
             type: mongoose.Schema.Types.ObjectId,
             ref:'Dish'
         }
     ]
},{
    timestamps: true
});

var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites
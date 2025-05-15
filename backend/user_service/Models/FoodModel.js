const mongoose = require("mongoose");
const {ObjectId}=mongoose.Schema;

const Schema=mongoose.Schema;

const FoodSchema=new Schema({
    name: { 
        type: String, //datatype
        required: true //validate
    },
    description:{
       type: String,
       trim: true,
       required : [true, 'Please add a product Description'],
    },
    price: { 
        type: Number, 
        required: true 
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    
    },
    category: {
        type: ObjectId,
        ref: "Category",
        required : [true, 'Product must belong to a category'],
    
    },
}, {timestamps: true});

module.exports= mongoose.model(
    "FoodsMenu", //file name
    FoodSchema  //function name
);

//https://upload-request.cloudinary.com/dewuexsqe/d6f820e7da94718db1245f27616bdd00
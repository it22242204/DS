const Food = require("../Models/FoodModel");
const Category = require("../Models/Category");
const ErrorResponse = require('../Services/ErrorResponse');
const cloudinary = require('../Services/Cloudinary');
const mongoose = require('mongoose');


exports.createProduct = async (req, res, next) => {

    const { name, description, price, image, category } = req.body;


    try {
        const result = await cloudinary.uploader.upload(image, {
            folder: "food_images",
            // width: 300,
            // crop: "scale"
        })
        const food = await Food.create({
            name,
            description,
            price,
            image: {
                public_id: result.public_id,
                url: result.secure_url
            },
            category
        });
        res.status(201).json({
            success: true,
            food
        })

    } catch (error) {
        console.log(error);
        next(error);

    }

}

exports.displayProduct = async (req, res, next) => {
    try {
        // Enable pagination
        const pageSize = 3;
        const page = Number(req.query.pageNumber) || 1;
        const count = await Food.countDocuments();

        // Fetch all category IDs
        const categories = await Category.find({}, { _id: 1 });
        const allCategoryIds = categories.map(cat => cat._id.toString());

        // Get category from query params
        let categoryQuery = req.query.cat;

        // Ensure category query is a valid ObjectId or use all categories
        let filter = {};
        if (categoryQuery && mongoose.Types.ObjectId.isValid(categoryQuery)) {
            filter.category = categoryQuery;
        }

        // Fetch products based on the filter
        const foods = await Food.find(filter)
            .populate('category', 'name')
            .skip(pageSize * (page - 1))
            .limit(pageSize);

        res.status(200).json({
            success: true,
            foods,
            page,
            pages: Math.ceil(count / pageSize),
            count
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
// Update product image in Cloudinary and product data in MongoDB.
exports.updateProduct = async (req, res, next) => {
    try {
        //current product
        const currentFood = await Food.findById(req.params.id);

        //build the data object
        const data = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category
        }

        //modify image conditionnally
        if (req.body.image !== '') {
            const ImgId = currentFood.image.public_id;
            if (ImgId) {
                await cloudinary.uploader.destroy(ImgId);
            }

            const newImage = await cloudinary.uploader.upload(req.body.image, {
                folder: "products",
                width: 1000,
                crop: "scale"
            });

            data.image = {
                public_id: newImage.public_id,
                url: newImage.secure_url
            }
        }

        const foodUpdate = await Food.findOneAndUpdate(req.params.id, data, { new: true })

        res.status(200).json({
            success: true,
            foodUpdate
        })


    } catch (error) {
        console.log(error);
        next(error);
    }

}



// delete product and product image in cloudinary
exports.deleteProduct = async (req, res, next) => {

    try {
        const food = await Food.findById(req.params.id);
        //retrieve current image ID
        const imgId = food.image.public_id;
        if (imgId) {
            await cloudinary.uploader.destroy(imgId);
        }

        const rmFood = await Food.findByIdAndDelete(req.params.id);

        res.status(201).json({
            success: true,
            message: " Product deleted",

        })

    } catch (error) {
        console.log(error);
        next(error);

    }

}





// display category
exports.productCategory = async (req, res, next) => {

    try {
        const cat = await Food.find().populate('category', 'name').distinct('category');
        res.status(201).json({
            success: true,
            cat
        })

    } catch (error) {
        console.log(error);
        next(error);
    }

}

exports.getProductById = async (req, res, next) => {
    try {
        const food = await Food.findById(req.params.id).populate('category', 'name');

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food item not found"
            });
        }

        res.status(200).json({
            success: true,
            food
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};


const {Schema, default: mongoose} = require("mongoose")

const productSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    }
}) 

const Product = mongoose.model("Product",productSchema)

module.exports = Product
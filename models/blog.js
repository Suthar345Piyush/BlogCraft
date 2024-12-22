// blog schema 
const { model, Schema } = require("mongoose");

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true  // Added to remove whitespace
    },
    
    body: {
        type: String,
        required: true
    },
     
    coverImageUrl: {
        type: String,
        required: false,
        default: null  // Added explicit default
    },
    
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",  // Ensure this matches your User model name exactly
        required: true
    }
}, { timestamps: true });

const Blog = model("Blog", blogSchema);  // Conventionally, model names start with capital letters

module.exports = Blog;
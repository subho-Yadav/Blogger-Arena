const mongoose = require('mongoose');
const ObjectId=mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true                  
    },
    body: {
        type: String, required: true
    },
    authorId: {
        type: ObjectId,
        ref: "Author",
    },
        tags: {
            type:[String],
            required:true
        },

        category: {
            type: String,
            required: true
        },
        subcategory: {
            type:[String],
            required:true
        },  // subcategory: {array of string, examples[technology-[web development, mobile development, AI, ML etc]] }, 
        isDeleted: { type: Boolean, default: false },
        publishedAt: {type:String,default:""}, // publishedAt: {when the blog is published}, isPublished: {boolean, default: false} 
        isPusblished:{type:Boolean,default:false},
        deletedAt:{type:String,default:""}
    },
 { timestamps: true });  // createdAt, updatedAt

module.exports = mongoose.model('Blog', blogSchema)

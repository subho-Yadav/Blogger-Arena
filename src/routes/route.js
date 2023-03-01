const express=require('express')
const router=express.Router()
//middlewares
const blogValidations=require('../Middlewares/blogValidations')
const authorValidations=require('../Middlewares/authorValidations')
const auth= require("../Middlewares/auth")
//Controllers
const createBlog=require('../controllers/blogController')
const createAuthor=require('../controllers/authorController')

router.post("/blogs/create-blog",auth.mid1,blogValidations.blogValidator,createBlog.createBlog)
router.post("/blogs/create-author",authorValidations.autorValidator,createAuthor.createAuthor)
 router.get("/getblog",auth.mid1, createBlog.getblog)
 router.post("/login",createAuthor.loginAuthor)
 router.put("/blogs/update-blog/:blogId",auth.mid1,auth.mid2, createBlog.updateBlog)
 router.put("/blogs/delete-blog/:blogId",auth.mid1,auth.mid2, createBlog.deleteBlog)
 router.put("/DELETE/blogs",auth.mid1,createBlog.deleteBlogByQuery)

// ,auth.mid1,auth.mid2

module.exports=router
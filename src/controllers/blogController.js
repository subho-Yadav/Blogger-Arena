const { isValidObjectId } = require('mongoose');
const blogModel=require('../Models/blogModel')
const authorModel=require('../Models/authorModel')
//create blog
const createBlog=async function(req,res){
    try{
    const data=req.body;
     const createdData=await blogModel.create(data)
        return res.status(201).send({status:true,successful:createdData})
    }
catch(error){
    res.status(500).send({status:false,error:error.message})
}
}

//update blog
const updateBlog = async (req,res)=>{
    try{
    const updateDetails=req.body
    const blogId=req.params.blogId
    
    const blog=await blogModel.findById(blogId)
    if(!blog||blog.isDeleted){
        return res.status(404).send({status:false,msg:"No blog found with the given ID"})
    }
        
    for(let i in updateDetails){
        if(i=='tags'){
            for(let j of updateDetails.tags){
                blog.tags.push(j)
            }
        }
        else if(i=='subcategory'){
            for(let j of updateDetails.subcategory){
                blog.subcategory.push(j)
            }
        }
        else if(i=='isPusblished'){
            if(updateDetails[i]==true){
            blog[i]=updateDetails[i]
            blog.publishedAt=new Date()
            }
            else{
                blog[i]=updateDetails[i]
                blog.publishedAt=""
            }
        }
        else{
            blog[i]=updateDetails[i]
            

        }
    }

    blog.save()

return res.status(200).send({status:true,msg:blog})
    }
    catch(error){
        res.status(500).send({status:false,err_msg:error.message})
    }
}

//delete blog by blog ID
const deleteBlog=async (req,res)=>{
    try{
    const blogId=req.params.blogId
    if(!isValidObjectId(blogId)){
        return res.status(400).send({status:false,msg:"BlogId is invalid"})
    }
    const blog=await blogModel.findById(blogId)
    if(!blog||blog.isDeleted){
       return res.status(404).send({status:false,msg:"Blog is not available"})
    }
    // if(blog.authorId!=req.abc.authorId){
    //     return res.send({status:false,msg:"Unauthorised operation"})
    // }
    blog.isDeleted=true
    blog.deletedAt=new Date()
    blog.save()
    return res.status(200).send() //README:Check if the blogId exists( and is not deleted). If it does, mark it deleted and return an HTTP status 200 without any response body.
}
catch(error){
    res.status(500).send({status:false,err_msg:error.message})
}
}

//get blogs API
const getblog= async (req,res)=>{
    
    try
    {
    
    let id=req.query.authorid
    let category=req.query.category
    let subcategory=req.query.subcategory
    let tags=req.query.tags
      if(id){
        if(!isValidObjectId(id)){
            return res.status(400).send({status:false,msg: "Author ID is not valid"})
        }
        const validAuthorIds= (await authorModel.find().select({_id:1})).map((author)=>author._id.toString())
    
        // return res.send({msg: typeof validAuthorIds[0]})
        
        if(!validAuthorIds.includes(id)){
        return res.status(400).send({status:false,msg: "Author is not registered"})
        }
        let blog=await blogModel.find({authorId:id,isDeleted:false,isPusblished:true}).populate('authorId')
        if(blog.length==0){
            return res.status(404).send({status:false,msg:"Blog not available"})
        }
        return res.status(200).send({status:true,status:true,data:blog})
      }
  // check by category
   else  if(category){
        let allcat=await blogModel.find({category:category,isDeleted:false,published:true }).populate('authorId')
        if(allcat.length==0)
        return res.status(404).send({status:false, msg:"Blog not found"})
        else 
        return res.status(200).send({status:true,data:allcat,count:allcat.length})
    }
    // check subcategory
    else if(subcategory){
        const availableBlogs=await blogModel.find({isDeleted:false})
        if(subcategory.indexOf(',')==-1){
            subcategory=[subcategory]
        }
        else{
        subcategory=subcategory.split(",")
        }
        
        const filteredBlog=availableBlogs.filter((blog)=>{
            let status=true
            
            for(let i of subcategory){
               if(blog.subcategory.includes(i)){
                continue
               }
              status=false
              break
            }
            return status
        })
        if(filteredBlog.length==0){
            return res.status(404).send({status:false,msg:"No blogs available with the given subcategory "})
        }
       return  res.send({status:false,msg:filteredBlog,count:filteredBlog.length})
    }

   
         // using tags check 
    
    else if(tags){
        const availableBlogs=await blogModel.find({isDeleted:false})
        if(tags.indexOf(',')==-1){
            tags=[tags]
        }
        else{
        tags=tags.split(",")
        }
        const filteredBlog=availableBlogs.filter((blog)=>{
            let status=true
            
            for(let i of tags){
               if(blog.tags.includes(i)){
                continue
               }
              status=false
              break
            }
            return status
        })
        if(filteredBlog.length==0){
            return res.status(404).send({status:false,msg:"No blogs available with the given tags"})
        }
       return  res.send({status:true,msg:filteredBlog,count:filteredBlog.length})
    }

    else{
        const blogs=await blogModel.find({isDeleted:false,isPusblished:true})
        return res.status(200).send({status:true,msg:blogs})
    }

   }
catch(error){
    res.status(500).send({status:false,"Server error":error.message})
}
}




//delete blog by query

const deleteBlogByQuery = async function (req, res) {
    try {
      let queries = req.query;
      if (Object.keys(queries) == 0) {
        return res.status(400).send({ status: false, msg: "query is required" });
      }
       let category=queries.category
       let id=queries.authorid
       let tags=queries.tags
       let subcategory=queries.subcategory

       
      if(id){
        if(!isValidObjectId(id)){
            return res.status(400).send({status:false,msg: "Author ID is not valid"})
        }
        if(req.abc.authorId!=id){
            return  res.status(401).send({status:false,msg:"Unauthorise"})
           }
    
        // const validAuthorIds= (await authorModel.find().select({_id:1})).map((author)=>author._id.toString());
        // // return res.send({msg: typeof validAuthorIds[0]}) 
        // if(!validAuthorIds.includes(id)){
        // return res.status(400).send({status:false,msg: "Author is not registered"})
        // }
        let blog=await blogModel.updateMany({authorId:id,isDeleted:false},{$set:{isDeleted:true,deletedAt:new Date()}},{new:true})
        if(blog.modifiedCount==0)
        return res.status(404).send({status:false, msg:"sorry your request not found"})
        return res.status(200).send({status:true,data:`blogs deleted: ${blog}`})
      }
      else  if(category){
       
        let allcat=await blogModel.updateMany({category:category,authorId:req.abc.authorId,isDeleted:false},{$set:{isDeleted:true,deletedAt:new Date()}},{new:true});
        if(allcat.modifiedCount==0)
        return res.status(404).send({status:false, msg:"sorry your request not found"})
        else 
        return res.status(200).send({status:true,data:`Blogs deleted: ${allcat}`})
    }
    if(tags){
    const availableBlogs=await blogModel.find({isDeleted:false,authorId:req.abc.authorId})
    if(availableBlogs.length==0){
        return res.send({status:false,msg:"No Blogs written by the logged in user"})
    }
        if(tags.indexOf(',')==-1){
            tags=[tags] 
        }
        else{
        tags=tags.split(",")
        }
        const filteredBlog=availableBlogs.filter((blog)=>{
            let status=true
            
            for(let i of tags){
               if(blog.tags.includes(i)){
                continue
               }
              status=false
              break
            }
            return status
        })
        filteredBlog.forEach((blog)=>{
           
                blog.isDeleted=true
                blog.deletedAt=new Date()
                blog.save()
            
        })
       return  res.status(200).send({status:true,msg:"Blogs deleted"})
    }

    if(subcategory){
        const availableBlogs=await blogModel.find({isDeleted:false,authorId:req.abc.authorId})
        if(availableBlogs.length==0){
            return res.send({status:false,msg:"No Blogs written by the logged in user"})
        }
            if(subcategory.indexOf(',')==-1){
                subcategory=[subcategory]
            }
            else{
            subcategory=subcategory.split(",")
            }
            const filteredBlog=availableBlogs.filter((blog)=>{
                let status=true
                
                for(let i of subcategory){
                   if(blog.subcategory.includes(i)){
                    continue
                   }
                  status=false
                  break
                }
                return status
            })
            filteredBlog.forEach((blog)=>{
               
                    blog.isDeleted=true
                    blog.deletedAt=new Date()
                    blog.save()
                
            })
            return res.status(200).send({status:true,msg:"Blogs deleted"})
        }
  
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };







module.exports.createBlog=createBlog
module.exports.updateBlog=updateBlog
module.exports.deleteBlog=deleteBlog
module.exports.getblog=getblog
module.exports.deleteBlogByQuery=deleteBlogByQuery






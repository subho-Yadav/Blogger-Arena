const authorModel=require('../Models/authorModel')
const{isValidObjectId}=require('mongoose')
const blogModel = require('../Models/blogModel')
const blogValidator=async (req,res,next)=>{
    try{
        
        if(Object.keys(req.body).length==0){
            return res.status(400).send({status:false,msg:"Request body is empty"})
        }
    if(!req.body.authorId){
        return res.status(400).send({msg: "Author ID is not present"})
    }
    if(!isValidObjectId(req.body.authorId)){
        return res.status(400).send({status:false,msg: "Author ID is not valid"})
    }
    const validAuthorIds= (await authorModel.find().select({_id:1})).map((author)=>author._id.toString())

    // return res.send({msg: typeof validAuthorIds[0]})
    
    if(!validAuthorIds.includes(req.body.authorId)){
    return res.status(400).send({status:false,msg: "Author is not registered"})
    }

    if(req.body.authorId!=req.abc.authorId){
        return res.status(400).send({status:false,msg: "Unauthorised"}) 
    }

    let mandatoryFields=["title","body","tags","subcategory","category"]
    const isAvailable = (data)=>{
        if(!req.body[data]){
            return false
        }
        return true
    }
    for(let i of mandatoryFields){
        if( !isAvailable(i)){
        return  res.status(400).send({status:false,err_msg:`${i} is not present`})
        }
     }
     if(typeof req.body.tags!='object'){
        return res.status(400).send({status:false,msg:"Please enter an array of tags"})
     }
     if(req.body.tags.length==0){
        return  res.status(400).send({status:false,err_msg:"Tags are empty"})
     }
     if(typeof req.body.subcategory!='object'){
        return res.status(400).send({status:false,msg:"Please enter an array of subcategory"})
     }
     if(req.body.subcategory.length==0){
        return  res.status(400).send({status:false,err_msg:"Subcategory is empty"})
     }

     for(let i of req.body.tags){
        if(typeof i!='string'){
            return res.status(400).send({status:false,msg:"Tags must contain strings"})
        }
     }

     for(let i of req.body.subcategory){
        if(typeof i!='string'){
            return res.status(400).send({status:false,msg:"Subcategory must contain strings"})
        }
     }
    mandatoryFields.splice(2,2)
     for(let i of mandatoryFields){
        req.body[i]=req.body[i].trim()
    }

     next()
}catch(error){res.status(500).send({status:false,msg:"Something is wrong in your client request"})}

}

module.exports.blogValidator=blogValidator






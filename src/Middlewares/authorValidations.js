const authorModel=require('../Models/authorModel')
const autorValidator=async (req,res,next)=>{
    try{
    const mandatoryFields=["fname","lname","email","password"]
    
    const validate=(prop,regx)=>{
        
        if(!req.body[prop]){                     
            return false
        }
        const result=req.body[prop].match(regx)
        
        if(!result){
            return false
        }
        else{
        return true
        }
    }
    try{
    for(let i of mandatoryFields){
        req.body[i]=req.body[i].trim()
    }
    req.body.title=req.body.title.trim()
}catch(error){return res.status(400).send({status:false,msg:"Request body empty"})}
    for(let i of mandatoryFields){
        if(i=='fname'||i=='lname'){
        if(!validate(i,/^[A-Za-z]+$/)){
            return res.status(400).send({status:false,msg:`${i} not valid`})
        }
        }
        else if(i=='email'){
            if(!validate(i,/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/)){
                return res.status(400).send({status:false,msg:`${i} not valid`})
            } 
        }
        
        else{
            if(!validate(i,/^(?=.*[A-Z0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/)){
                return res.status(400).send({status:false,msg:`Check either you have entered wrong ${i} or not entered any ${i} at all`})
            } 
        }
    }
    if(!["Mr", "Mrs", "Miss"].includes(req.body.title)){
        return res.status(400).send({msg:"Title is not valid!"}) 
    }
    const validEmail=await (await authorModel.find().select({_id:0,email:1})).map((author)=>{
       return  author.email
    })
    if(validEmail.includes(req.body.email)){
    return res.status(400).send({status:false,msg:"Duplicate email"})
    }
    
    
    next()
}
catch(error){
    res.status(500).send({status:false,msg:"Server error"})
}
}
module.exports.autorValidator=autorValidator
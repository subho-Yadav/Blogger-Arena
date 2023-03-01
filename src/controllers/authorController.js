const authorModel=require('../Models/authorModel')
const jwt = require("jsonwebtoken");

const createAuthor=async (req,res)=>{
   try{
    const data=req.body
    const savedData=await authorModel.create(data)
    res.status(201).send({status:true,Created:savedData})
}
catch(error){
    res.status(500).send({status:false,error:error.message})
}
}
const loginAuthor = async function (req, res) {
    let userName = req.body.email;
    let password = req.body.password;
   
    let author = await authorModel.findOne({ email: userName, password: password });
    if (!author)  
      return res.send({
        status: false,
        msg: "username or the password is not corerct",
      });

      let token = jwt.sign(
        {
          authorId: author._id.toString(),
          organisation: "BlogingPoint",
        },
        "Alone-But-Happy"
      );
      res.setHeader("x-api-key", token);
      res.send({ status: true, token: token });
    };

    
    
module.exports.createAuthor=createAuthor
module.exports.loginAuthor=loginAuthor


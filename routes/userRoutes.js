import express from "express";
import bcryt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();


// ............................................................................................................................

//  we can get all the objects

// router.get("/api/users",async(req,res)=>{
//   const users = await User.find();
//   if(users){
//     res.status(200).json(users);
//   }else{
//     res.status(404).json({message : `something went wrong`})
//   }
// });

// ............................................................................................................................

// we can find individual object with matching userName and role 😌

// http://localhost:5000/api/users/?role=artist 

// http://localhost:5000/api/users/?userName=krishna&role=dev

// http://localhost:5000/api/users/?userName=krishna&limit=2

router.get("/api/users", async (req,res)=>{
  try{
    const {userName , role , limit} = req.query;

    const allowedQueries = ["role" , "userName" , "limit"];
    
    
    const unknownQuery = Object.keys(req.query).filter((q) =>  !allowedQueries.includes(q));
    console.log(unknownQuery);
    // console.log(Boolean(unknownQuery));
    
    
    if(unknownQuery.length > 0){
      return res.status(400).json({message : `Unknown query params : ${unknownQuery.join(", ")}`})
    }

    let totalUsers = await User.countDocuments();
    // console.log(totalUsers);
    

    if(limit){
        const limtToNumber = Number(limit);
        if(isNaN(limtToNumber) || limit < 1 || limit > totalUsers){
          return res.status(400).json({message : "invalid limit value"})
        }
    }

    const filter = {};
    if(userName){
      filter.userName = userName;
    }
    if(role){
      filter.role = role;
    }
    
    const users = await User.find(filter).select("-password").limit(Number(limit));

    res.status(200).json(users);

  }catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// we can get only one object that matching to the id

router.get("/api/users/:id", async(req,res)=>{
  try{
    const user = await User.findById(req.params.id);
    if(user){
      res.status(200).json(user);
    }else{
      res.status(404).json({ message : ` user with id ${req.params.id} not found`})
    }
  }catch(err){
    res.status(500).json({ message : `something is wrong ${err.message}`})
  }
})

router.post("/api/users", async (req, res) => {
  // const userName = req.body.userName;
  // const password = req.body.password;
  // const role = req.body.role;
  const { userName, password, role } = req.body;
  const hashedPassword = await bcryt.hash(password , 10);

  if (!userName || !password || !role) {
    return res
      .status(400)
      .json({ message: "UserName, password, role should are mandatory" });
  } else {
    await User.create({ userName, password : hashedPassword , role });
    res.status(201).json({ message: "new user created" });
  }
});

router.put("/api/users/:id", async (req,res)=>{
  try{
    const {userName , password , role} = req.body;
    const updatedData = {};
    if(userName){
      updatedData.userName = userName;
    }
    if( password){
      const hashedPassword = await bcryt.hash(password , 10)
      updatedData.password = hashedPassword;
    }
    if(role){
      updatedData.role = role;
    }
    await User.findByIdAndUpdate(req.params.id , updatedData , {new : true});
    res.status(200).json({ message : `user with id- ${req.params.id} has been edited`})
  }catch(err){
    res.status(500).json({ message : `something went wrong while editing`})
  }
});


router.delete("/api/users/:id" , async(req,res) =>{
  try{
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message : `user with id - ${req.params.id} deleted`})
  }catch(err){
    res.status(500).json({ message : `sorry the id is wrong ${err.message}`})
  }
});

export default router;

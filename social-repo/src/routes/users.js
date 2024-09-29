const express=require('express');
const userRepo = require('../repos/user-repo');
const router=express.Router();

router.get("/users",async (req,res)=>{
    // for each route we've to perform 2 things
    // 1. Run a query as per the route.
    // 2.Send the result back to the person who made the request.
    const users=await userRepo.find();
    res.send(users);
});

router.get("/users/:id",async(req,res)=>{});

router.post("/users",async(req,res)=>{});

router.put("/users/:id", async(req,res)=>{});

router.delete("/users/:id",async(req,res)=>{});

module.exports=router;
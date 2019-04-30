const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup',async (req,res,next)=>{
    let user = await User.find({ email: req.body.email});
    if(user) return res.status(401).json({error: true, message: 'user_da_ton_tai'});
    let { password } = req.body;
    let hashPass =  await bcrypt.hash(password);
    if(!hashPass) return res.status(500).json({ error: true, message: 'ma_hoa_khong_thanh_cong'});
    let newUser = new User({
        _id         : new mongoose.Types.ObjectId,
        email       : req.body.email,
        password    : hashPass  
    })
    let saveUser = await newUser.save();
    if(!saveUser) return res.status(500).json({ error: true, message: 'khong_tao_dc_user'});
    return res.status(201).json({error: false, data: saveUser});
    //chu then status vao di
    //ua chu' di ngu~ roi a` n
    //lam cai sign in luon ko lam cho vi tui ko bik luu token o dau de vo web lay token kiu may thang khac nhu them san pham
    //ok
});
//chu dung callback dai qua'
router.post('/signin', async(req,res,next) =>{
    let { email, password } = req.body;
    let user = await User.findOne({email: email});
    // zay dc chua chu'
    if(!user) return res.status(401).json({ error: true, message: 'user_khong_ton_tai'});
    let checkPass = await bcrypt.compare(password, user.password);
    if(!checkPass) return res.status(401).json({ error: true, message: 'password_khong_ton_tai'});
    let token = await jwt.sign(
        {
            email: user.email,
            userId: user._id
        }, 
        'bigtan',
        {
            expiresIn: "1h"
        }
    );
    if(!token) return res.status(500).json({ error: true, message: 'khong_tao_dc_token'});
    res.status(200).json({error: false, data: token});
})

router.delete('/:userId',(req,res,next)=>{
    const id = req.params.userId;
    Product.remove({_id:id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: 'User deleted',
            request:{
                type:'POST',
                url:'http://localhost:3000/users',
                body:{ email:'String', password: 'string'}
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    });    
});

module.exports = router;

const express = require('express');
const User = require('../models/User');
const router = express.Router();
const expressAsyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');

const JWT_SECRET = process.env.JWT_SECRET;

router.route('/signup').post([
    body('email', 'Enter a valid email...').isEmail(),
    body('name', 'name min-length must be of 3 char').isLength({ min: 3 }),
    body('password', 'password min-length must be of 5 char').isLength({ min: 5 })
],expressAsyncHandler(async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){ return res.status(400).json({ errors: errors.array() }) };
    const hashedPass = await bcrypt.hash(req.body.password, 12);
    req.body.password = hashedPass;
    const { name, email, password } = req.body; 
    try {
        const searchUser = await User.findOne({email});
        if (searchUser){
            return res.status(201).json({
                status: "failed",
                message:  "user already exist..."
            });
        };
        const user = await User.create({ name, email, password });
        const { _id } = user;
        const token = jwt.sign({ name, email, _id}, JWT_SECRET)
        res.status(200).json({
            status: "success",
            data: { _id, token }
        });
    } catch (err) {
        res.status(400).json({
            status: "failed",
            message:  err.message
        });
    }
}));

router.route('/login').post([
    body('email', 'Enter above fields correctly...').isEmail(),
    body('password', 'Enter above fields correctly...').exists()
],expressAsyncHandler(async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){ return res.status(400).json({ errors: errors.array() }) };
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "user not found...."
            });
        }
        const passMatched = await bcrypt.compare(password, user.password);
        if (!passMatched) {
            return res.status(404).json({
                status: "failed",
                message: "Enter the above credentials correctly...."
            });
        };
        const { _id, name } = user;
        const token = jwt.sign({ name, email, _id }, JWT_SECRET);
        res.status(200).json({
            status: "success",
            data: { _id, token }
        });
    } catch (err) {
        res.status(400).json({
            status: "failed",
            message:  err.message
        });
    }
}));
router.route('/getuser').post(fetchUser, async (req,res)=>{
    try {
        const user = await User.findById(req.user).select('-password')
        return res.status(200).json({user})
    } catch (err) {
        res.status(400).json({
            status: "failed",
            message:  err.message
        });
    }
})

module.exports = router;
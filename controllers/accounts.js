const express = require('express')
const router = express.Router()
const User = require('../models/accounts')
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
exports.register = async (req, res) => {

    var errors = [];
    const params = req.body;
    if (!params.name) {
        errors.push({
            error: "please add a name"
        })
    }
    if (!params.password) {
        errors.push({
            error: "please add a password"
        })
    }
    if (!params.email) {
        errors.push({
            error: "please add a password"
        })
    }
    const hash = bcrypt.hashSync(params.password, salt);
    const user = new User({
        name: params.name,
        password: hash,
        email: params.email
    })

    try {
        const output = await user.save()
        res.json(output)
    } catch (err) {
        res.send({
            success: 0,
            error: err.message
        })
    }
}


exports.login = async (req, res) => {

    var errors = [];
    const params = req.body;



    if (!params.password) {
        errors.push({
            error: "please add a password"
        })
    }
    if (!params.email) {
        errors.push({
            error: "please add a email"
        })
    }

    if (errors.length > 0) {

        return res.send({
            success: 0,
            error: errors,
        })
    }



    try {
        const output = await User.countDocuments({ email: params.email });
        if (output > 0) {


            const user = await User.findOne({ email: params.email });
            let matched = await bcrypt.compare(params.password, user.password);

            var payload = {
                userId: user._id,
                firstName: user.name,
                email: user.email,
            };
            var token = jwt.sign({
                data: payload,
                // exp: Math.floor(Date.now() / 1000) + JWT_EXPIRY_SECONDS
            }, "JWT_KEY", {
                expiresIn: '30 days'
            });

            if (matched) {
                return res.send({ success: 1, message: "logged in" ,token})
            }
            else {
                return res.send({ success: 1, message: "wrong password" })
            }


        }
        if (output == 0) {
            return res.send({ success: 0, message: "no recored found" })
        }

    } catch (err) {
        res.send({
            success: 0,
            error: err.message
        })
    }
}

exports.info = async (req,res)=>{

    var data = req.identity.data;
    var userId = data.userId;

    try {
        const user = await User.findOne({ _id: userId });

        return res.send({
            success:1,
            message:"user details fetched successfully",
            item:user
        })
    }catch(err){
        res.send({
            success: 0,
            error: err.message
        })
    }
}
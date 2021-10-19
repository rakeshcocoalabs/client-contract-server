const User = require('../models/accounts');

const jwt = require('jsonwebtoken');



const auth = async (req, res, next) => {

 
   
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const userDetails = jwt.verify(token, "JWT_KEY");
        console.log(userDetails);
        const data = userDetails.data;
        const userId = data.userId;
        const user = await User.findOne({
            _id: userId
           
        });
        if (!user) {
            throw new Error()
        }
        req.identity = userDetails;
        req.token = token;
        next()

    } catch (error) {
        res.status(401).send({
            error: 'Not authorized to access this resource',
            message:error.message
        })
    }
}

module.exports = auth
const  jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const fetchUser = async (req, res, next)=>{
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({
            status: "failed",
            message: "please authenticate using a valid token..."
        });
    };
    try {
        const data = jwt.verify(authorization, JWT_SECRET)
        req.user = data._id;
        next();
    } catch (err) {
        return res.status(401).json({
            status: "failed",
            message: "please authenticate using a valid token..."
        });
    }
};

module.exports = fetchUser;
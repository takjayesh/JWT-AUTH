const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['authorization'];
    if(!token){
        return res.status(404).json({
            success: false,
            msg: 'Token not found'
        })
    }

    try{
        const bearerToken = token.split(' ')[1];
        const decodedData = jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET );
        req.userData = decodedData;

    }catch(error){
        return res.status(403).json({
            success: false,
            msg: 'Invalid token'
        })
    }

    return next();
};

module.exports = verifyToken;
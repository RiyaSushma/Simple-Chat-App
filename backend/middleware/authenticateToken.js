const jwt = require('jsonwebtoken');
const jwt_secret = "ThisisJwtSecretCodeforChatSystem";


const authenticateJwt = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(token) {
        jwt.verify(token, jwt_secret, (err, user) => {
            if(err) {
                console.error('JWT Verification Error:', err, token); 
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};
    

module.exports = authenticateJwt;
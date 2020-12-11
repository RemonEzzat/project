const jwt = require('jsonwebtoken');
const User = require('../model/users')
const auth = async(req, res, next)=>{
try{
    const token = req.header('Authorization').replace('bearer ','') //=> Bearer eybbbbb
    const decodedToken = jwt.verify(token,'NoDeCouRSe')
    console.log(decodedToken)
    const user = await User.findOne({_id:decodedToken._id,'tokens.token':token})
    console.log(user)
    if(!user) throw new Error()
    req.user = user
    req.token=token
    next()
}
catch(e){res.send('you need to login')}
}
module.exports = auth
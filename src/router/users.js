const express = require('express')
const User = require('../model/users')
const Artical = require('../model/articals')
const auth = require('../middleware/authmiddleware')
const multer = require('multer')
const uploadFile = multer({
    dest:'profiles',
    limits:{
        fileSize: 1024*1024*1024
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('please insert .....'))
        }
        cb(undefined, true)
    }
})
const router = new express.Router()

router.post('/user/add',(req,res)=>{
    const user = new User(req.body)
    user.save().then(()=>{
        res.status(200).send({
            status:1,
            data:user
        })
    }).catch((e)=>{
        res.status(200).send({
            status:0,
            data:e
        })
    })
})
router.post('/user/profileImage',auth, uploadFile.single('file'),async(req,res)=>{
    req.user.pimages = req.file.buffer
    await req.user.save()
},(err,req,res,next)=>{
    res.send(err)

})


router.post('/login',async(req,res)=>{
    data = await req.body
try{
    const myuser = await User.findByCredintials(data.email,data.password)
    const token = await myuser.generateToken()
    res.send({
        status:1,
        msg:'authenticated',
        data:{user:myuser},
        token: token
    })
}
catch(e){
res.send('unauthorized')
}
})

router.post('/logout',auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((singletoken)=>{
            return singletoken!= req.token
        })
        await req.user.save()
        res.send('loggedout')
    }
    catch(e){
res.send(e)
    }

})
router.post('/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send('loggedout')
    }
    catch(e){
res.send(e)
    }
})

router.post('/favorite',auth,async(req,res)=>{
    const articalId = req.params.id
    Artical.findById(articalId).then((artical)=>{
    res.send({ status:1, data:artical, err:''})
    })
    .catch(e=>{
        res.send({status:0,data:{},err:e})
    })
})

router.get('/profile',auth,async(req,res)=>{
    res.send(req.user)
})

router.delete('/profile',auth,async(req,res)=>{
    try{
await req.user.remove()
res.send('removed')
    }
    catch(e){
        res.send(e)
    }
})

module.exports = router


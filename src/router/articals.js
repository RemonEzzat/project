const express = require('express')
const auth = require('../middleware/authmiddleware')
const Artical = require('../model/articals')
const router = new express.Router()


router.post('/articals/add',auth,async(req,res)=>{
  const artical = new Artical({
    ...req.body,
    owner: req.user._id
})
console.log(req.user)
try{
    await artical.save()
    res.status(200).send(artical)
}catch(e){
    res.status(500).send(e)
}
})

router.get('/articals',async(req,res)=>{
      await Artical.find(function(err, foundArticles){
        if (!err) {
          res.send(foundArticles);
        } else {
          res.send(err);
        }
      });
  })

  router.get('/articals/:id',(req,res)=>{
    Artical.findById(req.params.id).then((artical)=>{
    res.send({ status:1, data:artical, err:''})
    })
    .catch(e=>{
        res.send({status:0,data:{},err:e})
    })
})

  router.patch('/edite/:id',auth,async(req,res)=>{
     req.body
    const keys = Object.keys(req.body) 
    console.log(keys)
    const allowed =['title','content']
    const isAvailable = keys.every(val=> allowed.includes(val) )
    if(!isAvailable) res.status(200).send('error')
try{
        const u =await Artical.findByIdAndUpdate(req.params.id,req.body,{})
        if(!u) return res.send('not found')
        res.send(u)
 
    }
    catch(e){
        res.send(e)

    }
  })
  router.delete("/articles",(req, res)=>{

    Artical.deleteMany(function(err){
      if (!err){
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });

 router.delete('/delete:articaltitle',auth,(req,res)=>{
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
          if (!err){
            res.send("Successfully deleted the corresponding article.");
          } else {
            res.send(err);
          }
        });
 })
module.exports = router

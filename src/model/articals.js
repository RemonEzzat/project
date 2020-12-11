const mongoose = require('mongoose')
const articalsSchema = new mongoose.Schema({
  title: String,
  content: String,
  owner:{type:mongoose.Schema.Types.ObjectId,required:true, ref:'User'}
})


const Artical = mongoose.model("Artical", articalsSchema);
module.exports = Artical
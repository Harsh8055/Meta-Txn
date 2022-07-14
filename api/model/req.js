const { default: mongoose } = require("mongoose");
const mogoose = require("mongoose")


const requestSchema = new mogoose.Schema({_id:mongoose.Types.ObjectId,request:Object, signature: String});

module.exports = mogoose.model("Requests", requestSchema)
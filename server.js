const express = require('express')
const schedule = require("node-schedule");
var cors = require('cors')
let Requests = require("./api/model/req");
const mongoose = require("mongoose");
const { request } = require('express');
const { response } = require('express');


const app = express()
const port = 8383
 

app.use(express.json())

app.use(express.urlencoded({ extended: false}));


const relay = async function (req, res, next) {
    schedule.scheduleJob("*/59 * * * * *", () => {
        console.log('i ran');
    })
    next()
  }

  app.use(relay);
  app.use(cors()) // Use this after the variable declaration


app.use(express.static("public"));
app.get('/', (req, res) => {
  res.status(200).send('<h1>Hello World!</h1>');
  
})

app.post("/", (req, res) => {
  console.log('req', req.body);
  const request = new Requests({_id:new mongoose.Types.ObjectId, request:req.body.request, signature:req.body.signature} );
  request.save().then(result => {
    console.log('res', result);
    res.status(200).json({req: result});
  }).catch(err=> {
    console.log('err', err);
    response.status(500);
    
  })
  res.redirect("/")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
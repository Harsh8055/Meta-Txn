const express = require('express')
const schedule = require("node-schedule");
var cors = require('cors')
// const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require("fs");

let Requests = require("./api/model/req");
// const mongoose = require("mongoose");
const { request } = require('express');
const { response } = require('express');
const { ethers } = require('ethers');

const abi_path = require.resolve("./api/Forwarder.json");
let json = fs.readFileSync(abi_path);
let abi = JSON.parse(json).abi;


let forwarderAdd = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

let PrivateKey = "0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897"; // env (xxx) hardhat locolnet key
let provider = "https://polygon-mumbai.g.alchemy.com/v2/kV8qIfhZYAYxIzeQrxfHrso9_R-ITP4y";

let Provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/")
let managerWallet = new ethers.Wallet(PrivateKey, Provider)
console.log('public key of manager wallet', managerWallet.address);

let contractForwarder = new ethers.Contract(forwarderAdd, abi, managerWallet);


const app = express()
const port = 8383


const allRequests = [];
 



app.use(express.json())

app.use(express.urlencoded({ extended: false}));


async function verifyTxn(req, sig) {
  console.log('req', req, sig);
  
let verify = await contractForwarder.verify(req, sig);
console.log('verifcation status', verify);

return verify
}


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

app.post("/", async (req, res) => {
  console.log('req', req.body);
  console.log('bal', await managerWallet.getBalance());


  if(verifyTxn(req.body.request, req.body.signature)) {
  allRequests.push(req.body);
  }
  console.log('all request', allRequests.length,allRequests);
  

  // const request = new Requests({_id:new mongoose.Types.ObjectId, request:req.body.request, signature:req.body.signature} );
  // request.save().then(result => {
  //   console.log('res', result);
  //   res.status(200).send({req: result});
  // }).catch(err=> {
  //   console.log('err', err);
  //   response.status(500);
    
  // })
  res.redirect("/")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
import { ethers } from "ethers";
// import { Web3} from "web3";
// import { Web3 } from "web3.js-browser";
import Axios from "axios"
import abii  from "./abi.json";
// import registry from "./reg.json"
import Mytoken from "./token.json";
import sigUtil from 'eth-sig-util';

function App() {


var url = "http://localhost:8383/"

  async function sign() {

    // let accounts = await window.web3.eth.getAccounts();
// console.log(accounts[0]);
    // A Web3Provider wraps a standard Web3 provider, which is
// what MetaMask injects as window.ethereum into each page
const provider = new ethers.providers.Web3Provider(window.ethereum)
console.log('', provider);


// MetaMask requires requesting permission to connect users accounts
await provider.send("eth_requestAccounts", []);

// The MetaMask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, you need the account signer...
const signer = provider.getSigner()  
let address = await signer.getAddress();
console.log('address', address);

// 31337// REGISTRY - 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

const forwarderContract = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", abii.abi, signer);
// const reg = new ethers.Contract("0x8A791620dd6260079BF849Dc5567aDC3F2FdC318", registry.abi, signer);
const mytoken = new ethers.Contract("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", Mytoken.abi, signer);


const nonce = await forwarderContract.getNonce(await signer.getAddress());
console.log('nonce', Number(nonce));

const { request, signature } = await signMetaTxRequest(signer, forwarderContract, {
  from: address,
  to: mytoken.address,
  data: mytoken.interface.encodeFunctionData('mint', [address, 1]),
});

console.log('re', request, signature);
  
}


function submit(req, sig) {
  console.log('---', {req, sig});
  
  Axios.post(url, {
    request: req, 
    signature: sig
  }).then(res => {
    console.log('res', res.data);
    
  })

}

const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' }
];

const ForwardRequest = [
  { name: 'from', type: 'address' },
  { name: 'to', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'gas', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'data', type: 'bytes' },
];

function getMetaTxTypeData(chainId, verifyingContract) {
  return {
    types: {
      EIP712Domain,
      ForwardRequest,
    },
    domain: {
      name: 'MinimalForwarder',
      version: '0.0.1',
      chainId,
      verifyingContract,
    },
    primaryType: 'ForwardRequest',
  }
};

// async function signTypedData(signer, from, data) {
//   // If signer is a private key, use it to sign
//   if (typeof(signer) === 'string') {
//     const privateKey = Buffer.from(signer.replace(/^0x/, ''), 'hex');
//     return ethSigUtil.signTypedMessage(privateKey, { data });
//   }

//   // Otherwise, send the signTypedData RPC call
//   // Note that hardhatvm and metamask require different EIP712 input
//   const isHardhat = data.domain.chainId == 31337;
//   const [method, argData] = isHardhat
//     ? ['eth_signTypedData', data]
//     : ['eth_signTypedData_v4', JSON.stringify(data)]
//   return await signer.send(method, [from, argData]);
// }

async function buildRequest(forwarder, input) {
  const nonce = await forwarder.getNonce(input.from).then(nonce => nonce.toString());
  return { value: 0, gas: 1e6, nonce, ...input };
}

async function buildTypedData(forwarder, request) {
  const chainId = await forwarder.provider.getNetwork().then(n => n.chainId);
  const typeData = getMetaTxTypeData(chainId, forwarder.address);
  return { ...typeData, message: request };
}

async function signMetaTxRequest(signer, forwarder, input) {
  console.log('-------a');

  const request = await buildRequest(forwarder, input);
  console.log('-------a', request);

  const toSign = await buildTypedData(forwarder, request);
  console.log('-------a', toSign);


    let sig = await window.ethereum.request(
    {
        method: "eth_signTypedData_v4",
        params: [await signer.getAddress(), JSON.stringify(toSign)],
    },
    function(err, result) {
        if (err) {
            return console.error(err);
        }
        const signature = result.result.substring(2);
        console.log('sig', signature);
        
        // const r = "0x" + signature.substring(0, 64);
        // const s = "0x" + signature.substring(64, 128);
        // const v = parseInt(signature.substring(128, 130), 16);
        // The signature is now comprised of r, s, and         


        }
      );
  // let signature = await signer._signTypedData(toSign.domain, toSign.types, request);
 
  console.log('sig', sig, "req--", request);

  let recover = await forwarder.verify(request, sig);
  console.log('recover', recover);
  
  submit(request, sig);

  
  // const recovered =  sigUtil.recoverTypedSignature_v4({
  //   data: toSign,
  //   sig: sig,
  // });
  // console.log('recoverd', recovered);
  
  
  return { request, sig };  
}



// Initialize Constants
// let forwarder = new ethers.Contract(, , biconomy.getSignerByAddress(userAddress));
  
/* let contractInterface = new ethers.utils.Interface(<CONTRACT_ABI>);

let userAddress = <Selected Address>;

// Create your target method signature.. here we are calling setQuote() method of our contract
let { data } = await contract.populateTransaction.setQuote(newQuote);
let provider = biconomy.getEthersProvider();

let gasLimit = await provider.estimateGas({
        to: config.contract.address,
        from: userAddress,
        data: data
    });
console.log("Gas limit : ", gasLimit);

let txParams = {
        data: data,
        to: <CONTRACT_ADDRESS>,
        from: userAddress,
        gasLimit: gasLimit, // optional
        signatureType: "EIP712_SIGN"
    };

// as ethers does not allow providing custom options while sending transaction                 
let tx = await provider.send("eth_sendTransaction", [txParams]);
console.log("Transaction hash : ", tx); */


  return (
    <div className="App" style={{ marginRight: '20px' }}>
      
          {/* <input type="text" id="input" placeholder="name"> */}
          {/* <input type="number" id="input" /> */}
        <button id="sign" 
        style={{
        marginLeft: '660px',
        marginTop: '300px',
        width: '50px',
        height: '50px',
        backgroundColor: 'yellow',
      }} onClick={sign}> Mint </button>
       
    </div>
  );
}

export default App;

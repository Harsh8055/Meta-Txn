const { expect } = require("chai");
const { ethers } = require("hardhat");
const { signMetaTxRequest } = require("../src/signer");

async function deploy(name, ...params) {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then(f => f.deployed());
}

describe("contracts/Registry", function() {
  beforeEach(async function() {
    this.forwarder = await deploy('MinimalForwarder2'); // relayer contract 
    this.registry = await deploy("Registry", this.forwarder.address);    
    this.accounts = await ethers.getSigners();
    this.token = await deploy("MyToken", "d", "fd", this.forwarder.address)
  });

  it("registers a name directly", async function() {
    const sender = this.accounts[1];
    const registry = this.registry.connect(sender);
    
    const receipt = await registry.register('defender').then(tx => tx.wait());
    expect(receipt.events[0].event).to.equal('Registered');

    expect(await registry.owners('defender')).to.equal(sender.address);
    expect(await registry.names(sender.address)).to.equal('defender');
  });

  it("registers a name via a meta-tx", async function() {
    const signer = this.accounts[2];
    let privateKeyOfSigner = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";
    
    const relayer = this.accounts[3];
    const forwarder = this.forwarder.connect(relayer);
    const registry = this.registry;

// user signs the txn with his private key
    const { request, signature } = await signMetaTxRequest(privateKeyOfSigner, forwarder, {
      from: signer.address,
      to: this.token.address,
      data: this.token.interface.encodeFunctionData('mint', [signer.address, 1]),
    });
    console.log(request,'signature', signature);

    const { request2, signature2 } = await signMetaTxRequest(privateKeyOfSigner, forwarder, {
      from: signer.address,
      to: registry.address,
      data: registry.interface.encodeFunctionData('register', ['meta-txs3']),
    });
    // we call the forawarder to execute the txn. we pay gas fees for txn here
    console.log('balance before', await relayer.getBalance());
    // console.log('balance before', await forwarder.getBalance());
    console.log(request2,'signature2', signature2);
    
    
    let batchRelay =  await forwarder.relayBatch([request], [signature]);
    await batchRelay.wait()
    // await this.batchRelayer.relayBatch([request, request2], [signature, signature2]).then(tx => tx.wait());
    console.log('balance aft', await relayer.getBalance());
    // console.log('balance aft', await forwarder.getBalance());


    // expect(await registry.owners('meta-txs')).to.equal(signer.address);
    // expect(await registry.names(signer.address)).to.equal('meta-txs');
  });
});
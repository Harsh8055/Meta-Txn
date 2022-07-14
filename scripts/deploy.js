const { ethers } = require('hardhat');
const { writeFileSync } = require('fs');

async function deploy(name, ...params) {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then(f => f.deployed());
}

async function main() {
  const forwarder = await deploy('MinimalForwarder');
  const registry = await deploy("Registry", forwarder.address);
  const mytoken = await deploy("MyToken", "mytoken", "mtk",forwarder.address);

  writeFileSync('deploy.json', JSON.stringify({
    MinimalForwarder: forwarder.address,
    Registry: registry.address,
    MyToken: mytoken.address
  }, null, 2));

  console.log(`MinimalForwarder: ${forwarder.address}\nRegistry: ${registry.address}  MyToken: ${mytoken.address}`);
   
}

if (require.main === module) {
  main().then(() => process.exit(0))
    .catch(error => { console.error(error); process.exit(1); });
}
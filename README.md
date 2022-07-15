Documentation to run Frontend locally - 


you must have node js installed in your system. 

1)run  ``` npm install ```;
2) update the address of the contract in ```src/add.json```, i.e update the addresses to the latest. To get the Forwarder Address and tokenAddress, to get the addresses,  switch to branch master and run 
  ``` npx hardhat run scripts/deploy.js --network localhost ```
  it might ask you to run a local hardhat node, to run a local blockchain node you might open a  new terminal in the same folder and run ``` npx hardhat node``` and then run the above command again


3) run ``` npm start```, this should run the frontend in your local system at localhost:3000;


3) open page, call the mint function. it will ask for a EIP712 signature if metamask is installed; 
4) sign it, make sure the backend node is running as well before calling it so that it can send the signature to the backend via POST api.
 
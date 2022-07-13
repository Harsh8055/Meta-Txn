// SPDX-License-Identifier:MIT
pragma solidity ^0.8.9;

import "./MinimalForwarder.sol";

contract BatchRelayer is MinimalForwarder2  {

   
  address public forwarder;

   constructor(address _forwarder) {
    forwarder = _forwarder;
   }


   function relayBatch(ForwardRequest[] calldata req, bytes[] calldata signature)
        public
        payable
        returns (bool, bytes memory)
    {
        require(req.length == signature.length, "X");
       unchecked {

           for (uint i = 0; i < signature.length; i++) {
             
             
             MinimalForwarder2(forwarder).execute(req[i], signature[i]);
               
           }

       }
        
    }

}
const fs = require('fs')

const Ape = artifacts.require("./Ape.sol")
const ApePool = artifacts.require("./ApePool.sol")

module.exports = function(deployer) {
  deployer.deploy(ApePool,Ape.address).then(
      ()=>{
          if(ApePool._json){
              fs.writeFile('./deployedABI', JSON.stringify(ApePool._json.abi),
              (err) => {
                  if(err) throw err;
                  console.log("ABI 입력 성공");
                }
              )
            
             fs.writeFile('./deployedAddress', ApePool.address, 
                (err) => {
                    if(err) throw err;
                    console.log("주소 입력 성공");
                }
             )

          }
      }
  )
};

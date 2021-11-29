const fs = require('fs')
const Ape = artifacts.require("./Ape.sol")

module.exports = function(deployer) {
  deployer.deploy(Ape).then(
      ()=>{
          if(Ape._json){
              fs.writeFile('./deployedABI', JSON.stringify(Ape._json.abi),
              (err) => {
                  if(err) throw err;
                  console.log("ABI 입력 성공");
                }
              )
            
             fs.writeFile('./deployedAddress', Ape.address, 
                (err) => {
                    if(err) throw err;
                    console.log("주소 입력 성공");
                }
             )

          }
      }
  )
};

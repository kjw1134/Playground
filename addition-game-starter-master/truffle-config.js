// truffle.js config for klaytn.
const PrivateKeyConnector = require('@truffle/hdwallet-provider')
const NETWORK_ID = '1001' //밥오밥 고유 아이디
const GASLIMIT = '2000000'
const URL = 'https://api.baobab.klaytn.net:8651'
const PRIVATE_KEY = '0x7bd9f2a502c323e0d9333d82c43b51f3039f6181772a36948a0904eafd5eb315'

module.exports = {
    networks:{
        klaytn:{
            provider: new PrivateKeyConnector(PRIVATE_KEY, URL),
            network_id:NETWORK_ID,
            gas: GASLIMIT,
            gasPrice: null,
        }
    },
}
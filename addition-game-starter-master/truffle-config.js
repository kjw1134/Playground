// truffle.js config for klaytn.
const PrivateKeyConnector = require('@truffle/hdwallet-provider')
const NETWORK_ID = '1001' //바오밥 고유 아이디
const GASLIMIT = '2000000'
const URL = 'https://api.baobab.klaytn.net:8651'
const PRIVATE_KEY = '0x2db67f709c7d5920cf115aee7907b7da4cfe87fde0f94ab8c67613322bd2254e'

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
import Caver from "caver-js";

const config={
  rpcURL:'https://api.baobab.klaytn.net:8651'
}

const cav = new Caver(config.rpcURL);
const App = {

  auth:{
    accessType : 'keystore',
    keystore:'',
    password:''
  },

  start: async function () {

  },

  handleImport: async function () {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0]);
    fileReader.onload = (event )=>{
      try{
        if(!this.checkValidKeystore(event.target.result)){
            $('#message').text('invalid keystore file');
            return;
        }
        
        this.auth.keystore = evnet.target.result;
        $('#message').text('valid keystore file\n input password');
        document.querySelector('#input-password').focus();

      }catch(event){
        $('#message').text('invalid keystore file');
        return;
      }
    }
  },

  handlePassword: async function () {
    this.auth.password = evnet.target.value;
  },

  handleLogin: async function () {

    try { 
       const accounts = await klaytn.enable();
       $('#wallet-address').text('address : ' + accounts);

     } catch (error) {  
      $('#wallet-address').text('connect wallet failed!');
      }
    // if(this.auth.accessType=='keystore')
    // {
    //   try{
    //     const privatekey = cav.klay.accounts.decrypt(this.auth.keystore, this.auth.password).privateKey;
    //     this.integrateWallet(privatekey)
    //   }
    //   catch (e){
    //     $('#message').text('password is not correct');
    //   }
    // }
  },

  handleLogout: async function () {
    this.removeWallet();
    location.reload();
  },

  generateNumbers: async function () {

  },

  submitAnswer: async function () {

  },

  deposit: async function () {

  },

  callOwner: async function () {

  },

  callContractBalance: async function () {

  },

  getWallet: function () {

  },

  checkValidKeystore: function (keystore) {
    const parsedKeystore = JSON.parse(keystore);
    const isValidKeystore = parsedKeystore.version &&
    parsedKeystore.id &&
    parsedKeystore.address &&
    parsedKeystore.crypto;

  return isValidKeystore;


  },

  integrateWallet: function (privateKey) {
    const walletInstance = cav.klay.accounts.privateKeyToAccount(privatekey);
    cav.klay.accounts.wallet.add(walletInstance);

    //페이지에 저장
    sessionStorage.setItem('wallterInstance', JSON.stringify(walletInstance));

    this.changeUI(walletInstance);
  },

  reset: function () {
    this.auth = {
      keystore:'',
      password:'',
    };
  },

  changeUI: async function (walletInstance) {

   // const connecter_address = document.getElementById("wallet-address");
     //  connecter_address.innerHTML = walletInstance.address;
    // $('#loginModal').modal('hide');
    // $('#login').hide();
    // $('#logout').show();
     $('#wallet-address').append('<br>'+'<p>'+'my account address: ' + walletInstance.address +'</p>');

  },

  removeWallet: function () {
    cav.klay.accounts.wallet.clear();
    sessionStorage.removeItem('walletInstance');
    this.reset();
  },

  showTimer: function () {

  },

  showSpinner: function () {

  },

  receiveKlay: function () {

  }
};

window.App = App;

window.addEventListener("load", function () {
  App.start();
});

var opts = {
  lines: 10, // The number of lines to draw
  length: 30, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  color: '#5bc0de', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: 'spinner', // The CSS class to assign to the spinner
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  position: 'absolute' // Element positioning
};
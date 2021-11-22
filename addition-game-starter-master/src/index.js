import Caver from "caver-js";
import { Spinner } from "spin.js";
const config={
  rpcURL:'https://api.baobab.klaytn.net:8651'
}

const cav = new Caver(config.rpcURL);
                                        //bApp내 사용가능 전역상수
const agContract = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const App = {

  auth:{
    accessType : 'keystore',
    keystore:'',
    password:''
  },

  start: async function () {

  },

  // handleImport: async function () {
  //   const fileReader = new FileReader();
  //   fileReader.readAsText(event.target.files[0]);
  //   fileReader.onload = (event )=>{
  //     try{
  //       if(!this.checkValidKeystore(event.target.result)){
  //           $('#message').text('invalid keystore file');
  //           return;
  //       }
        
  //       this.auth.keystore = evnet.target.result;
  //       $('#message').text('valid keystore file\n input password');
  //       document.querySelector('#input-password').focus();

  //     }catch(event){
  //       $('#message').text('invalid keystore file');
  //       return;
  //     }
  //   }
  // },

  handlePassword: async function () {
    this.auth.password = evnet.target.value;
  },

  handleLogin: async function () {

    try { 
       const accounts = await klaytn.enable();
       //$('#wallet-address').text('address : ' + accounts);
       this.changeUI(accounts);

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

  // handleLogout: async function () {
  //   this.removeWallet();
  //   location.reload();
  // },

  generateNumbers: async function () {
    var num1 = Math.floor((Math.random()*50) +10);//0~1 소수점
    var num2 = Math.floor((Math.random()*50) +10);//0~1 소수점

    sessionStorage.setItem('result', num1+num2);

    $('#start').hide();
    $('#num1').text(num1);
    $('#num2').text(num2);
    $('#qeustion').show();

    document.querySelector('#answer').focus();

    this.showTimer();

  },

  submitAnswer: async function () {
    const result = sessionStorage.getItem('result');
    var answer = $('#answer').val();

    if(answer==result){
      if(confirm("0.1 klay 받기")){
        if(await this.callContractBalance() >= 0.1){
          this.receiveKlay();
        }else{
          alert("klay=0");
        }
      }
    }
    else{
      alert("fail");
    }
  },

  deposit: async function () {

    console.log(`deposit`);
    var spinner = this.showSpinner();
    const walletInstance = String(this.getWallet());
    const callowner = await this.callOwner();

    

      if(walletInstance){
        if(callowner.toUpperCase() != walletInstance.toUpperCase()) return;
        else{
          var amount = $('#amount').val();

          if(amount){
            agContract.methods.deposit().send({
              from:callowner,//비앱네 계정인증 완료된 계정만 사용가능
              value:cav.utils.toPeb(amount, "KLAY"),
              gas:'250000'
            })
            // .once('transactionHash', (transactionHash)=> {
            //   console.log(`txHash: ${transactionHash}`);
            // })
            // .once('receipt', (receipt)=>{
            //   console.log(`(#${receipt.blockNuber})`, receipt);
            //   spinner.stop();
            //   alert(amount +'KLAY 컨트렉에 송급했습니다.');
            //   location.reload(); // 페이지 새로고침
            // })
            // .once('error', (error)=>{
            //   alert(error.message);
            // });
            spinner.stop();
          }
          return;
        }
      }
      else{
        console.log(`wallet instance =null`);
        spinner.stop();
      }
  },

  callOwner: async function () {
    return await agContract.methods.owner().call();
  },

  callContractBalance: async function () {
    return await agContract.methods.getBalance().call();
  },

  getWallet: function () {

    if(klaytn.selectedAddress){
      return klaytn.selectedAddress;//로그인계정
    }
    else{
      console.log(`getwallet fail`);
    }
  },

  // checkValidKeystore: function (keystore) {
  //   const parsedKeystore = JSON.parse(keystore);
  //   const isValidKeystore = parsedKeystore.version &&
  //   parsedKeystore.id &&
  //   parsedKeystore.address &&
  //   parsedKeystore.crypto;

  // return isValidKeystore;
  // },

  // integrateWallet: function (privateKey) {
  //   const walletInstance = cav.klay.accounts.privateKeyToAccount(privatekey);
  //   cav.klay.accounts.wallet.add(walletInstance);

  //   //페이지에 저장
  //   sessionStorage.setItem('wallterInstance', JSON.stringify(walletInstance));

  //   this.changeUI(walletInstance);
  // },

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
    $('#game').show();
     $('#wallet-address').append('<br>'+'<p>'+'my account address: ' + walletInstance +'</p>');
     $('#contractBalance'). append('<p>'+ '이벤트 잔액 :' +  cav.utils.fromPeb(await this.callContractBalance(), "KLAY") + 'KLAY' + '</p>');

     const thisOwnerAddress =await this.callOwner();     
     const curAddress = String(walletInstance);

     if(thisOwnerAddress.toUpperCase()===curAddress.toUpperCase()){
       $('#owner').show();
     }
  },

  // removeWallet: function () {
  //   cav.klay.accounts.wallet.clear();
  //   sessionStorage.removeItem('walletInstance');
  //   this.reset();
  // },

  showTimer: function () {
    var sec = 10;
    $('#timer').text(sec);

    var interval = setInterval(() =>{
      $('#timer').text(--sec);

      if(sec <=0)
      {
        $('#timer').text('');
        $('#answer').text('');
        $('#qeustion').hide();
        $('#start').show();
        clearInterval(interval);

      }
    },1000);
  },

  showSpinner: function () {
    var target = document.getElementById("spin");
    return new Spinner(opts).spin(target)
  },

  receiveKlay: function () {
    var spinner = this.showSpinner();

    const walltetInstance = this.getWallet();

    if(!walletInstance) return;

    agContract.methods.transfer(cav.utils.toPeb("0.1", "KLAY")).send({
      from:walletInstance,
      gas:'250000'
    }).then(function(receipt){
      if(receipt.status){
        spinner.stop();
        alert("0.1Klay transfer");
        $('#transaction').html("");
        $('#transaction')
        .append(`<p><a href= 'https://baobab.scope.klaytn.com/tx/${receipt.transactionHash}' 
        target='_blank'> Klaytn scope </a></p>`);

        return agContract.methods.getBalance().call()
        .then(function(balance){
          $('#contractBalance').html("");
          $('#contractBalance')
          .append('<p>' + 'balance : ' + cav.utils.fromPeb(balance, "KLAY")+'KLAY' + '</p>');
        })

      }
    })
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
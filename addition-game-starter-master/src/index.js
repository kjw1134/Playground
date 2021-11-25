import Caver from "caver-js";
import { Spinner } from "spin.js";
const config={
  rpcURL:'https://api.baobab.klaytn.net:8651'
}

const contract_address='0xb3e1abb61996d2b5d6a712d2156dfe154edcc451';
const cav = new Caver(config.rpcURL);
                                        //bApp내 사용가능 전역상수
const agContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const App = {

  

  setSendPram:function(_sendParam){
    this.sendParam = _sendParam;
  },

  start: async function () {
    this.handleLogin();

  },

  handleLogin: async function () {

    const { klaytn } = window;
    if (klaytn === undefined) {
      alert("kiakas must be installed");
      return;
    }

    try { 
       const accounts = await klaytn.enable();
       if(accounts)
       {
        $('#logout').show();
        $('#login').hide();
       }
        
       
       //$('#wallet-address').text('address : ' + accounts);
       this.changeUI(accounts);

     } catch (error) {  
      $('#wallet-address').text('connect wallet failed!');
      }
  },

  
  handleLogout: async function () {
    this.removeWallet();
    location.reload();
  },

  handleSign: async function (_from,_to,_value,_gas) {

    console.log(klaytn.selectedAddress);

    caver.klay.sendTransaction({
      from:_from,
      to:_to,
      value:cav.utils.toPeb(_value.toString(), 'KLAY'),
      gas:_gas
    })
      .once('transactionHash', (transactionHash) => {
        console.log('txHash', transactionHash)
      })
      .once('receipt', (receipt) => {
        console.log('receipt', receipt)
      })
      .once('error', (error) => {
        console.log('error', error)
      });
    
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
             // to:agContract._address,
              value:cav.utils.toPeb(amount, "KLAY"),
              gas:'250000'
            })
            .once('receipt', (receipt) => {
              console.log('receipt', receipt)
              spinner.stop();
              alert(amount +'KLAY 컨트렉에 송급했습니다.');
              location.reload(); // 페이지 새로고침
            })
            .once('error', (error) => {
              alert(error.message);
            });

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
  
   receiveKlay: function () {

    var spinner = this.showSpinner();
    const walletInstance = this.getWallet();
    if(!walletInstance) return;

    const value = '0.5';
    //this.handleSign(agContract._address,walletInstance,value,'250000');

    agContract.methods.transfer(caver.utils.toPeb(value, 'KLAY')).send({
      from:walletInstance,
      gas:'250000'
    }).then(function(receipt){
      if(receipt.status){
        spinner.stop();
        alert("0.5Klay transfer");
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

  showSpinner: function () {
    var target = document.getElementById("spin");
    return new Spinner(opts).spin(target)
  },

  


  removeWallet: function () {
    //klaytn.disable();
    //this.reset();
  },

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

  handlePassword: async function () {
    //this.auth.password = evnet.target.value;
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
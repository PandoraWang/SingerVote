App = {
  web3Provider: null,
  contracts: {},
  names: new Array(),
  url: 'http://127.0.0.1:7545',
  chairPerson:null,
  currentAccount:null,
  init: function() {
    $.getJSON('../proposals.json', function(data) {
      var proposalsRow = $('#proposalsRow');
      var proposalTemplate = $('#proposalTemplate');

      for (i = 0; i < data.length; i ++) {
        proposalTemplate.find('.panel-title').text(data[i].name);
        proposalTemplate.find('img').attr('src', data[i].picture);
        proposalTemplate.find('.btn-prevote').attr('data-id', data[i].id);
        proposalTemplate.find('.btn-finvote').attr('data-id', data[i].id);
        proposalTemplate.find('.btn-finished').attr('data-id', data[i].id);
        proposalsRow.append(proposalTemplate.html());
        App.names.push(data[i].name);
      }
    });
    return App.initWeb3();
  },

  initWeb3: function() {
        // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider(App.url);
    }
    web3 = new Web3(App.web3Provider);

    ethereum.enable();

    App.populateAddress();
    return App.initContract();
  },

  initContract: function() {
      $.getJSON('Ballot.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    var voteArtifact = data;
    App.contracts.vote = TruffleContract(voteArtifact);

    // Set the provider for our contract
    App.contracts.vote.setProvider(App.web3Provider);
    
    App.getChairperson();
    return App.bindEvents();
  });
  },

  bindEvents: function() {
    $(document).on('click', '.btn-prevote', App.handlePreVote);
    $(document).on('click', '.btn-finvote', App.handleFinVote);
    $(document).on('click', '.btn-finished', App.handleFinished);
    $(document).on('click', '#pre-rank', App.handlePreRank);
    $(document).on('click', '#fin-rank', App.handleFinRank);
    $(document).on('click', '#cur-state', App.handleCurState);
    $(document).on('click', '#register', function(){ var ad = $('#enter_address').val(); App.handleRegister(ad); });
    $(document).on('click', '#state', function(){ var phase = $('#enter_state').val(); App.handleState(phase); });
    $(document).on('click', '#voter', function(){ var ad = $('#enter_address').val(); App.handleVoter(ad); });
  },

  populateAddress : function(){
    new Web3(new Web3.providers.HttpProvider(App.url)).eth.getAccounts((err, accounts) => {
      jQuery.each(accounts,function(i){
        if(web3.eth.coinbase != accounts[i]){
          var optionElement = '<option value="'+accounts[i]+'">'+accounts[i]+'</option';
          jQuery('#enter_address').append(optionElement);  
        }
      });
    });
  },

  getChairperson : function(){
    App.contracts.vote.deployed().then(function(instance) {
      return instance;
    }).then(function(result) {
      App.chairPerson = result.constructor.currentProvider.selectedAddress.toString();
      App.currentAccount = web3.eth.coinbase;
      if(App.chairPerson != App.currentAccount){
        jQuery('#address_div').css('display','none');
        jQuery('#register_div').css('display','none');
      }else{
        jQuery('#address_div').css('display','block');
        jQuery('#register_div').css('display','block');
      }
    })
  },

  handleRegister: function(addr){

    var voteInstance;
    App.contracts.vote.deployed().then(function(instance) {
      voteInstance = instance;
      return voteInstance.register(addr);
    }).then(function(result, err){
        if(result){
            if(parseInt(result.receipt.status) == 1)
            alert(addr + " registration done successfully")
            else
            alert(addr + " registration not done successfully due to revert")
        } else {
            alert(addr + " registration failed")
        }   
    });
},

  handleState: function(phase){

    var voteInstance;
    App.contracts.vote.deployed().then(function(instance) {
      voteInstance = instance;
      return voteInstance.changeState(phase);
    }).then(function(result, err){
        if(result){
            if(parseInt(result.receipt.status) == 1)
            alert("change state to "+ phase+" done successfully")
            else
            alert("change state to "+phase+"not done successfully due to revert")
        } else {
            alert("change state to "+phase+" failed")
        }   
    });
},

  handleFinished: function(event) {
    event.preventDefault();
    var proposalId = parseInt($(event.target).data('id'));
    var voteInstance;

    web3.eth.getAccounts(function(error, accounts) {
      var account = accounts[0];

      App.contracts.vote.deployed().then(function(instance) {
        voteInstance = instance;

        return voteInstance.markFinished(proposalId, {from: account});
      }).then(function(result, err){
            if(result){
                console.log(result.receipt.status);
                if(parseInt(result.receipt.status) == 1)
                alert(account + " marked finished done successfully")
                else
                alert(account + " marked finished not done successfully due to revert")
            } else {
                alert(account + " marked finished failed")
            }   
        });
    });
  },

  handlePreVote: function(event) {
    event.preventDefault();
    var proposalId = parseInt($(event.target).data('id'));
    var voteInstance;

    web3.eth.getAccounts(function(error, accounts) {
      var account = accounts[0];

      App.contracts.vote.deployed().then(function(instance) {
        voteInstance = instance;

        return voteInstance.preVote(proposalId, {from: account});
      }).then(function(result, err){
            if(result){
                console.log(result.receipt.status);
                if(parseInt(result.receipt.status) == 1)
                alert(account + " voting done successfully")
                else
                alert(account + " voting not done successfully due to revert")
            } else {
                alert(account + " voting failed")
            }   
        });
    });
  },

  handleFinVote: function(event) {
    event.preventDefault();
    var proposalId = parseInt($(event.target).data('id'));
    var voteInstance;

    web3.eth.getAccounts(function(error, accounts) {
      var account = accounts[0];

      App.contracts.vote.deployed().then(function(instance) {
        voteInstance = instance;

        return voteInstance.finVote(proposalId, {from: account});
      }).then(function(result, err){
            if(result){
                console.log(result.receipt.status);
                if(parseInt(result.receipt.status) == 1)
                alert(account + " voting done successfully")
                else
                alert(account + " voting not done successfully due to revert")
            } else {
                alert(account + " voting failed")
            }   
        });
    });
  },

  handlePreRank : function() {
    console.log("To get pre rank");
    var voteInstance;
    App.contracts.vote.deployed().then(function(instance) {
      voteInstance = instance;
      return voteInstance.preSingersRanking();
    }).then(function(res,err){
      arr = []
      for(i =0;i<res.length;i++){
        votes = res[i]["c"][0]
        if(arr[votes]!=undefined){
          arr[votes] += ","+i.toString(10)
        }else{
          arr[votes] = i.toString(10)
        }
        
      }
      rank =1
      announce =""
      for(i = arr.length-1;i>=0;i--){
        if(arr[i]!=undefined){
          indexArray = arr[i].split(",");
          announce+= "Rank "+ rank.toString(10)+" : "
          for(j = 0;j<indexArray.length;j++){
            announce += App.names[parseInt(indexArray[j])]+", "
          }
          announce += "["+(i+1).toString(10)+"]"
          announce += "\n"
          rank+=1
        }
      }
      alert(announce)
    }).catch(function(err){
      console.log(err.message);
    })
  },

  handleFinRank : function() {
    console.log("To get final rank");
    var voteInstance;
    App.contracts.vote.deployed().then(function(instance) {
      voteInstance = instance;
      return voteInstance.finalSingersRanking();
    }).then(function(res){
      arr = []
      for(i =0;i<res.length;i++){
        votes = res[i]["c"][0]
        if(arr[votes]!=undefined){
          arr[votes] += ","+i.toString(10)
        }else{
          arr[votes] = i.toString(10)
        }
      }
      rank =1
      announce =""
      for(i = arr.length-1;i>=0;i--){
        if(arr[i]!=undefined){
          indexArray = arr[i].split(",");
          announce+= "Rank "+ rank.toString(10)+" : "
          for(j = 0;j<indexArray.length;j++){
            announce += App.names[parseInt(indexArray[j])]+", "
          }
          announce += "["+(i+1).toString(10)+"]"
          announce += "\n"
          rank+=1
        }
      }
      alert(announce)
    }).catch(function(err){
      console.log(err.message);
    })
  },

  handleCurState : function() {
    var voteInstance;
    App.contracts.vote.deployed().then(function(instance) {
      voteInstance = instance;
      return voteInstance.getState();
    }).then(function(res){
      console.log(res["c"][0]);
    }).catch(function(err){
      console.log(err.message);
    })
  },

  handleVoter : function(addr) {
    var voteInstance;
    App.contracts.vote.deployed().then(function(instance) {
      voteInstance = instance;
      return voteInstance.getVoter(addr);
    }).then(function(res){
      console.log(res[0]["c"][0]);
      console.log(res[1]["c"][0]);
    }).catch(function(err){
      console.log(err.message);
    })
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

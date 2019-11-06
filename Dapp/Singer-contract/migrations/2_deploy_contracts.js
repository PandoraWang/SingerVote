var Singer = artifacts.require("Ballot");
 
module.exports = function(deployer) {
  deployer.deploy(Singer,4);
};


const Migrations = artifacts.require("PasswordManager");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};

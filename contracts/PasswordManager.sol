// SPDX-License-Identifier: Unlicense
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract PasswordManager {
    
    struct Credentials {
        string username;
        string password;
    }
    
    mapping (address => mapping (string => Credentials)) private users;
    mapping (address => string[]) private userWebsites;
    
    function saveCredentials(string memory website, string memory username, string memory password) public {
        users[msg.sender][website] = Credentials(username, password);
        if (!websiteExists(msg.sender, website)) {
            userWebsites[msg.sender].push(website);
        }
    }
    
    function getCredentials(string memory website) public view returns (string memory, string memory) {
        Credentials memory creds = users[msg.sender][website];
        return (creds.username, creds.password);
    }
    
    function getAllCredentialsForCurrentUser() public view returns (string[] memory websites, string[] memory usernames, string[] memory passwords) {
        uint256 count = userWebsites[msg.sender].length;
        websites = new string[](count);
        usernames = new string[](count);
        passwords = new string[](count);
        for (uint256 i = 0; i < count; i++) {
            string memory website = userWebsites[msg.sender][i];
            Credentials memory creds = users[msg.sender][website];
            websites[i] = website;
            usernames[i] = creds.username;
            passwords[i] = creds.password;
        }
        return (websites, usernames, passwords);
    }
    
function deleteCredentials(string memory website) public {
    require(websiteExists(msg.sender, website), "Website does not exist for this user");
    delete users[msg.sender][website];
    uint256 indexToDelete;
    for (uint256 i = 0; i < userWebsites[msg.sender].length; i++) {
        if (keccak256(abi.encodePacked(userWebsites[msg.sender][i])) == keccak256(abi.encodePacked(website))) {
            indexToDelete = i;
            break;
        }
    }
    for (uint256 i = indexToDelete; i < userWebsites[msg.sender].length - 1; i++) {
        userWebsites[msg.sender][i] = userWebsites[msg.sender][i+1];
    }
    userWebsites[msg.sender].pop();
}

    
    function websiteExists(address user, string memory website) private view returns (bool) {
        for (uint i = 0; i < userWebsites[user].length; i++) {
            if (keccak256(abi.encodePacked(userWebsites[user][i])) == keccak256(abi.encodePacked(website))) {
                return true;
            }
        }
        return false;
    }
}
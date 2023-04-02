// SPDX-License-Identifier: Unlicense
pragma solidity >=0.4.22 <0.9.0;

contract PasswordManager {
    struct Credentials {
        string usernameCID;
        string passwordCID;
    }

    mapping (string => Credentials) private credentialsMap;

    function storeCredentials(string memory website, string memory usernameCID, string memory passwordCID) public {
        Credentials memory credentials = Credentials(usernameCID, passwordCID);
        credentialsMap[website] = credentials;
    }

    function getCredentials(string memory website) public view returns (string memory, string memory) {
        Credentials memory credentials = credentialsMap[website];
        return (credentials.usernameCID, credentials.passwordCID);
    }
}
# Decentralised Password Manager

A mini project for the subject Blockchain Lab, BEIT
Group Memebers: Kishor Jena, Rahul Chuahan, Ritik Kandare

### How to run

Prerequisite:
Make sure Ganache is running and Metamask is connected.

### Step to Run

1. Run the command inside project directory where package.json exist

    `npm install`

2. Install truffle

    `npm -g install truffle`

3. Compile COntract

    `truffle compile`

4. Deploy contract 

    `truffle deploy`

5. Then copy contract address of PasswordManager and replace it in `src\utils.js`

6. Copy content from `build\contracts\PasswordManager.json` to `src\abi.json`

7. Run

    `npm start`

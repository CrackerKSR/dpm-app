import logo from './logo.svg';
import './App.css';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ThirdwebStorage,IpfsUploader } from '@thirdweb-dev/storage';
// import { useStorage } from "@thirdweb/react";
import Web3 from 'web3'
import { CommonSymbolSchema } from '@thirdweb-dev/sdk';
const myContractABI = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "website",
        "type": "string"
      },
      {
        "name": "usernameCID",
        "type": "string"
      },
      {
        "name": "passwordCID",
        "type": "string"
      }
    ],
    "name": "storeCredentials",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x69d8f5fb"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "website",
        "type": "string"
      }
    ],
    "name": "getCredentials",
    "outputs": [
      {
        "name": "",
        "type": "string"
      },
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xf6b1a22b"
  }
]
// const web3 = new Web3('http://127.0.0.1:7545');
// const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
const web3 = new Web3(window.ethereum);


const abi = 'build/contracts/PasswordManager.json'
const address = '0x415F33f50120a16A7a68Ec1004D5114E72DA81B1'

// console.log('currentProvider ',web3.currentProvider)
// const passwordManager = new web3.eth.Contract(contractAbi, contractAddress);

web3.eth.getAccounts()
.then(from=>{
  (async()=>{
    const contract = new web3.eth.Contract(myContractABI, address);
    console.log('before ',from[0]);
    let site = String('example.com');
    let username = String('QmQPzSauKgt4M5XsCYF8JUd54XprFZZ9HyALk4WW6ywbi8');
    let password = String('QmQPzSauKgt4M5XsCYF8JUd54XprFZZ9HyALk4WW6ywbi8');
    // const result = await contract.methods.storeCredentials(site, username, password).send({ from: from[0] });
    const result = await contract.methods.getCredentials(site ).call()
    // console.log('after')
    console.log('result ',result); // prints the transaction receipt
  })()
})




function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);



  React.useEffect(()=>{

    if(file!==null){

    }
    // console.log('window.ethereum ',web3.eth.Contract(abi, address))
  },[file])

  const handleFileChange=(e)=>{
    console.log('file change, set file ')
    const file = e.target.files[0];
    setFile(file)
  }
 


  const save = async() =>{

    if(file!==null){
      // First, instantiate the thirdweb IPFS storage
      const storage = new ThirdwebStorage();

      // Here we get the IPFS URI of where our metadata has been uploaded
      const uri = await storage.upload(file);
      // This will log a URL like ipfs://QmWgbcjKWCXhaLzMz4gNBxQpAHktQK6MkLvBkKXbsoWEEy/0
      console.info(uri);

      // Here we a URL with a gateway that we can look at in the browser
      const url = await storage.resolveScheme(uri);
      // This will log a URL like https://ipfs.thirdwebcdn.com/ipfs/QmWgbcjKWCXhaLzMz4gNBxQpAHktQK6MkLvBkKXbsoWEEy/0
      console.info(url);

      // You can also download the data from the uri
      const data = await storage.downloadJSON(uri);
      console.log(data)
      return uri
    }else{
      console.log('file null.. uploading cancelled..')
      return null
    }
  }

  const do1 = async() => {
    const website = "www.example.com";
    const username = "abc";
    const password = "123";

    // await passwordManagerInstance.storeCredentials(website, username, password);

  }

  const get1 = async()=>{
    console.log('retriving... ');
    const website = "www.example.com";

    // const credentials = await passwordManagerInstance.getCredentials(website);

    // console.log(credentials.username);
    // console.log(credentials.password);

  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div>

      </div>
      <input type="file" onChange={handleFileChange} />
      <h6>Data: {data}</h6>
      <button value={'save'} onClick={save}> Save </button>

    </div>
  );
}

export default App;

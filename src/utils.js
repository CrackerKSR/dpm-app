import Web3 from 'web3'
import PasswordManagerABI  from './abi.json'

const Contractaddress = '0xdf9989BD82875f171208D54e82b83869503d43B8'


const web3 = new Web3(window.ethereum);

export const getAccounts = async()=>{
    const accounts =  await web3.eth.getAccounts()
    return accounts
}

export const getContract = async()=>{
    const contract = new web3.eth.Contract(PasswordManagerABI.abi, Contractaddress);
    return contract
}


export const saveCreds = async(site, user, pass)=>{
    const from = await getAccounts()
    const contract = await getContract();
    let res=null;
    try{
        res = await contract.methods.saveCredentials(site, user, pass).send({ from: from[0] });
    }catch(e){
        console.log('saveCreds issue:-> ',e);
    }
    return res;
}


export const fetchAllCreds = async()=>{
    const from = await getAccounts()
    const contract = await getContract();
    return await contract.methods.getAllCredentialsForCurrentUser().call({ from: from[0] })
}

export const deleteRecord = async(website)=>{
    const from = await getAccounts()
    const contract = await getContract();
    return await contract.methods.deleteCredentials(website).send({ from: from[0] })
}

export const checkMeta = () => {

    window.ethereum.request({ method: 'eth_requestAccounts' })
    .then(accounts => {
      console.log('accounts ',accounts)

    })
    .catch(error => {
      console.error(error);
      alert(error.message)
    });
}


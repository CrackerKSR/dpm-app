import logo from './logo.svg';
import './App.css';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ThirdwebStorage,IpfsUploader } from '@thirdweb-dev/storage';
// import { useStorage } from "@thirdweb/react";
import Web3 from 'web3'
import { CommonSymbolSchema } from '@thirdweb-dev/sdk';
import { DatePicker, Table, Switch} from 'antd';

import PasswordManagerABI  from './abi.json'

import { getAccounts, getContract, fetchAllCreds, saveCreds, checkMeta, deleteRecord } from './utils';

import { 
  EyeInvisibleOutlined, 
  EyeOutlined, 
  EditOutlined, 
  CopyOutlined,
  UserOutlined,
  LockOutlined,
  DownloadOutlined,
  DeleteOutlined ,
  LinkOutlined
} from '@ant-design/icons';

import { 
  Button, 
  Space, 
  Input, 
  Alert, 
  message,
  Layout,
  Typography,
  Empty,
  Divider,
  Form,
  Row, 
  Col,
  
} from 'antd';

import { ReactComponent as MetamaskIcon } from './metamask.svg';
const { Header, Content, Footer } = Layout;
const { Title, Text  } = Typography;

const { Search } = Input



const APP_NAME = "DecentraLock"
const TAGLINE = "The secure blockchain password manager"
const Login_Message_Text = `Logged in to ${APP_NAME} !`

function ShowAlert(){
  return (<Alert
    message="Metamask is not connected!"
    description={`Please connect metamask to use ${APP_NAME}`}
    type="warning"
    showIcon
  />)
}

const warningMsg = {
  type: 'error',
  content: 'Processing metamask',
}

const loginMsg = {
  type: 'success',
  content: Login_Message_Text,
}


const combinePairs=(data)=>{
  const sites = data[0];
  const usernames = data[1];
  const passwords = data[2];

  return sites.map((site, index) => ({
    key:index,
    site,
    username: usernames[index],
    password: passwords[index],
  }));
}

function App() {
  const [credential , setCredential ] = useState(null);
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [showIndex, setShowIndex] = useState(-1);
  const [etherium, setEtherium] = useState(-1);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {

    // check etherium support
    checkEtheriumSupport();

    // Request MetaMask Connection
    requestMetamask();

    // get all stored records from blochain
    fetchRecords();

  }, []);

  const fetchRecords=()=>{
    fetchAllCreds().then(data=>{
      let combo = combinePairs(data)
      setCredential(combo)
    })
  }

  const requestMetamask=()=>{
    if(!window.ethereum){
      console.log("Not etherium ")
      message.warning("Etherium is missing!")
    }else{
      window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        setAccounts(accounts);
        setIsMetaMaskConnected(true);
        message.open(loginMsg)
      })
      .catch(error => {
        console.error('eth req ',error);
        // message.open(warningMsg)
      });
    }

  }

  const checkEtheriumSupport=()=>{

    if (!window.ethereum) {
      setEtherium(false)
    }else{
      setEtherium(true)
    }
  }

 
  if (!isMetaMaskConnected) {
    return (
      
      <Space className="App-header">
        <Space sizze="large" direction='vertical' align="center">
          <Text>A mini project for Blockchain Lab</Text>
          <Title level={1}>{APP_NAME}</Title>
          <Text>{TAGLINE}</Text>
        </Space>
        <h6 className="warn" onClick={()=>{checkMeta();}}>Open Metamask</h6>
          <ShowAlert/>
      </Space>
    )

  }


  const onCopyUsername = (index) => {
    let record = credential.filter((item)=>item.key===index)[0]
    navigator.clipboard.writeText(record['username']);
  };
  
  const onCopyPassword = (index,field) => {
    let record = credential.filter((item)=>item.key===index)[0]
    navigator.clipboard.writeText(record['password']);
  };

  const onDelete =(index)=>{
    // TODO
    // let obj = credential.filter((item)=>{item.key==index})
    let record = credential.filter((item)=>item.key===index)[0]
    // let toDel = credential.filter(i=>i.key===index)
    console.log('record to delt ',record.site);

    deleteRecord(record.site)
    .then(res=>{
      console.log(' delete res ',res)
      fetchRecords();
    })
    .catch(er=>{
      console.log(' delete err ',er.message)
    })
    
  }
  
  const editRecord =(index)=>{
    // TODO save 
    console.log(" editing...",index)
  }

  const getIconsForUsername=(currentIndex)=>{
    return (
      <Space>
        <CopyOutlined onClick={(e)=>onCopyUsername(currentIndex)}/>
      </Space>
    )
  } 

  const getIconsForPassword=(currentIndex)=>{

    const ToggleButton = currentIndex === showIndex ? 
    (<EyeOutlined onClick={() => { setShowIndex(currentIndex === showIndex ? -1 : currentIndex) }} />)
    :
    (<EyeInvisibleOutlined onClick={() => { setShowIndex(currentIndex === showIndex ? -1 : currentIndex) }} />) 
    
    return (
      <Space>
        {ToggleButton}
        <CopyOutlined onClick={(e)=>onCopyPassword(currentIndex)} />
      </Space>
    )

  } 

  const cols = [
    {
      title: 'site'.toUpperCase(),
      dataIndex: 'site',
      key: 'site',
      
    },
    {
      title: 'username'.toUpperCase(),
      dataIndex: 'username',
      key: 'username',
      render:(text, record, currentIndex)=>{
        return (
          <Space>
            <Input addonAfter={getIconsForUsername(currentIndex)} value={text} readOnly  />
          </Space>
        )
      }
    },

    {
      title: 'password'.toUpperCase(),
      dataIndex: 'password',
      key: 'password',
      render:(text,record,currentIndex )=>{
        return(
          <Space size="middle" direction="horizontal">
            <Input addonAfter={getIconsForPassword(currentIndex)} value={currentIndex === showIndex ? text:"•".repeat(text.length)} readOnly  />
            {/* <Text align="right" editable copyable ellipsis style={{ border: "0px solid blue", padding: "5px", width:"200px" }} >{text}</Text> */}
          </Space>
        )
      }
    },
    {
      title: 'Misc'.toUpperCase(),
      dataIndex: 'Misc',
      key: 'Misc',
      render:(text,record,currentIndex )=>{
        return(
          <Space size="middle" direction="horizontal">
            <EditOutlined style={{ color: 'green' }} onClick={()=>{
              // console.log("currentIndex ",currentIndex);
              
            }} />
            <DeleteOutlined style={{ color: 'red' }} onClick={()=>{
              onDelete(currentIndex)
            }}/>
            {/* <Input copyable addonAfter={getIconsForPassword(currentIndex)} value={currentIndex === showIndex ? text:"•".repeat(text?.length)} readOnly  /> */}
            {/* <Text align="right" editable copyable ellipsis style={{ border: "0px solid blue", padding: "5px", width:"200px" }} >{text}</Text> */}
            
          </Space>
        )
      }
    },

  ]
  
  const onFinish = (values) => {
    saveCreds(values.website, values.username, values.password)
    .then(res=>{
      console.log("res ",res);
      message.success("Credentials saved successfully");
      fetchRecords()
    }).catch(e=>message.error('Error saving... ',e.message))
  };

  const DemoForm = () => {
  
    return (
      <Form layout="vertical" onFinish={onFinish}>
      <Row gutter={16}>
      <Col span={8}>
          <Form.Item
            name="website"
            rules={[
              {
                required: true,
                message: 'Please input the website URL',
              },
            ]}
          >
            <Input placeholder="Website URL" prefix={<LinkOutlined />} />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username',
              },
            ]}
          >
            <Input placeholder="Username" prefix={<UserOutlined />} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password',
              },
            ]}
          >
            <Input.Password placeholder="Password" prefix={<LockOutlined />}/>
          </Form.Item>
        </Col>

        <Col span={4}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Col>
      </Row>
    </Form>
    );
  };
  
  return(
    <Layout align="center">
      <Content>
        <Space size="large" direction="vertical">
          <header className="App-header2">
 
            <Title level={1}>{APP_NAME}</Title>
            <Text>{TAGLINE}</Text>

          </header>
          <hr/>
          <Divider />
          <Space align="left">
            <Text style={{textAlign: 'left'}}>{"Save new credential"}</Text>
          </Space>
          <DemoForm/>
          <Divider />
          <hr/>
          <Space align="left">
            <Text>{"Saved Credentials"}</Text>
          </Space>
          <Space>
            <Table dataSource={credential} columns={cols} />
          </Space>
            <Button type="primary" onClick={()=>{fetchRecords();}} >Refresh</Button>

        </Space>
      </Content>
    </Layout>
  );
}

export default App;

// React
import React, {Component} from 'react';
var createReactClass = require('create-react-class');
var ReactDOM = require('react-dom');
import postData from './data.json';

// Design
import { Button, Layout, Menu, Breadcrumb, List, Avatar, InputNumber} from 'antd';
const { Header, Content, Footer } = Layout;
import 'antd/dist/antd.min.css';
var Link = require('react-router').Link;
const _ = require('lodash');
var Payeth = require('./payEth');


// SmatContract
const contractAddress = '0x9663543c5fa87c0502149a9fa186dc24738ac84c';
const abi = require('../../Contract/abi');
const mycontract = web3.eth.contract(abi);
const myContractInstance = mycontract.at(contractAddress);

// Dataparsing
function parseJson(Resp){
  // console.log(Resp);
  const results = [];
  // var parameters = ['task','location','incent','owner','status'];//web3.toAscii(res)
  Resp.forEach((paramValues, paramIndex) => {
    // const item = _.map(paramValues[0],paramValues[3]);
    results.push({zipcode: paramValues[0], connetivity: paramValues[3]});
  })
  console.log(results);

  return results.slice(1,20);
}


// metaMask listener
window.addEventListener('load', function() {
        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
           if (typeof web3 !== 'undefined') {
                // Use Mist/MetaMask's provider
                window.web3 = new Web3(web3.currentProvider);
            } else {
                console.log('No web3? You should consider trying MetaMask!')
                // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
                window.web3 = new Web3(new Web3.providers.HttpProvider("https://localhost:8545"));
        }
      });


class About extends Component{
    render(){
        return(

          <Layout className="layout">
           <Header>
            <div className="logo" />
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                style={{ lineHeight: '64px' }}
              >
                <Menu.Item key="1">Task Status</Menu.Item>
                <Menu.Item key="2"><Link to={"/"}>Dash Board</Link></Menu.Item>
                {/* <Menu.Item key="3"><Link to={"/admin"}>Submit Task</Link></Menu.Item>
                <Menu.Item key="4"><Link to={"/ipfs"}>Validate</Link></Menu.Item> */}

              </Menu>
          </Header>
            <Content style={{ padding: '0 50px' }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
              </Breadcrumb>
              <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>

              <br />
              <br />

        <List
                itemLayout="horizontal"
                dataSource={this.state.data}

                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      
                      avatar={<Avatar src="https://i.pinimg.com/236x/59/cb/10/59cb10c177662eaf625b2cb80da3d4dd.jpg" />}
                      // title={<a href={"https://rinkeby.etherscan.io/address/"+item.address}>{"Location of the bounty is "+ item.connetivity }</a>}
                      title={<a href={"http://school-mapping.azurewebsites.net/"}>{"donate token to zipcode  "+ item.zipcode }</a>}
                      description={ " the connectivity of this location is  "+ item.connetivity }
                    />
                    <InputNumber min={1} max={10000000000000000000000} defaultValue={0} onChange={value => this.updateFormField(value)}/>. . .          
                    {/* onChange={this.getsecondQuestion} */}
                    <Button type="primary" value={item.zipcode} onClick={()=>this.getfirstQuestion(item.zipcode)}>{ "donate" }</Button> | | 
                    <Button type="primary" value={item.zipcode} onClick={()=>this.onBid(item.zipcode)}>{ "bid" }</Button> | | 

                  </List.Item>
                )}
              />
              </div>
            </Content>
              <p>   Input number to commit your responsibility: </p>

        </Layout>

        );
    }

    constructor(props){
      super(props);
      this.getfirstQuestion = this.getfirstQuestion.bind(this);
      this.updateFormField = this.updateFormField.bind(this);



      this.state = {
        score:0,
        account: web3.eth.accounts[0],
        key1: '',
        key2:'',
        scoreboard:[],
        scores:[],
        data:[],
        inputValue:0
      }
    }

  async  updateFormField (value) {
        this.setState({
          inputValue: value
        })
        console.log(this.state.inputValue);
      
    }

  async componentWillMount() {

     var answerInJson = parseJson(postData.result);
     var data = answerInJson;
     this.setState( {data});

  }

  async getfirstQuestion(value){
      console.log("clicked" , value);
      var token = this.state.inputValue;
      console.log("the token is "+ token);

      var getData = myContractInstance.transfer.getData(web3.eth.accounts[0], token, web3.toHex(value));
      await web3.eth.sendTransaction({from: web3.eth.accounts[0], to: contractAddress, data:getData},(err, res) =>{
        console.log(res);
      });

  }

  async onBid(value){
    var token = this.state.inputValue;
    console.log("the token is "+ token);

    var getData = myContractInstance.bid.getData(token, web3.toHex(value));
    await web3.eth.sendTransaction({from: web3.eth.accounts[0], to: contractAddress, data:getData},(err, res) =>{
      console.log(res);
    });

}




};



module.exports = About;

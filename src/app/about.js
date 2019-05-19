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
const contractAddress = '0xcea2c44f0286735f775aed1231e82b6dec5142ba';
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

    // results[paramIndex] = item;
    // const paramName = parameters[paramIndex];
    // var values;
    // const item = _.merge({}, _.get(results, [paramIndex], {}));

    // Resp[paramValues].forEach((paramValue, itemIndex) =>{
      
      // if (paramIndex == 0){
    // item[paramIndex] = paramValues[0];
      // }
      // else if(paramIndex == 1){
      //   item[paramName] = paramValue;
      // }

      // else if(paramIndex == 2){
      //   item[paramName] = paramValue.c[0];
      // }

      // else if(paramIndex == 3){
      //   item[paramName] = paramValue;
      // }

      // else if(paramIndex == 4){
      //   counter += 1;
      //   if (paramValue.c[0] == 0){item[paramName] = "open"+ counter.toString();}
      //   if (paramValue.c[0] == 1){item[paramName] = "in progress"+ counter.toString();}
      //   if (paramValue.c[0] == 2){item[paramName] = "closed"+ counter.toString();}
      // }



      // results[paramIndex] = item;
    // }
    // )
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
                    <InputNumber min={1} max={100} defaultValue={0}  />. . .          
                    {/* onChange={this.getsecondQuestion} */}
                    <Button type="primary" onClick={this.getfirstQuestion}>{ "donate" }</Button> | | 
                    <Button type="primary" onClick={this.getfirstQuestion}>{ "bid" }</Button>

                  </List.Item>
                )}
              />
              {/* {postData.map((postDetail, index) => {
                return <h1>{postDetail.Content}</h1>
              })} */}
              </div>
              {/* <Search placeholder="input the bounty" enterButton="Submit" size="large" onSearch={value => this.getsecondQuestion(value)}/> */}


            </Content>
              <p>   Input number to commit your responsibility: </p>

        </Layout>

        );
    }

    constructor(props){
      super(props);
      this.getfirstQuestion = this.getfirstQuestion.bind(this);

      this.state = {
        score:0,
        account: web3.eth.accounts[0],
        key1: '',
        key2:'',
        scoreboard:[],
        scores:[],
        data:[],
      }
    }

  async componentWillMount() {

    //  await myContractInstance.getAllbounty(function(err,result){
    //  var res = result;
     var answerInJson = parseJson(postData.result);
     var data = answerInJson;
     this.setState( {data});
  // }.bind(this));

  }

  async getfirstQuestion(value){
      console.log("clicked");
  }


};



module.exports = About;

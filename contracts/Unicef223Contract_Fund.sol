pragma solidity ^0.4.23;

import "./DetailedERC20.sol";
import "./MintableToken.sol";
import "./BurnableToken.sol";
import "./ERC223ReceivingContract.sol";

contract MyERC223 is DetailedERC20, MintableToken, BurnableToken {
    constructor (string _name, string _symbol, uint8 _decimals) public
        DetailedERC20(_name, _symbol, _decimals)
    {}

/**  
* @dev Details of each transfer  
* @param contract_ contract address of ER20 token to transfer  
* @param to_ receiving account  
* @param amount_ number of tokens to transfer to_ account  
* @param failed_ if transfer was successful or not  
*/  
struct Transaction {  
  //address contract_;  
  address to_;  
  uint amount_;  
  bytes32 data_;
  bool failed_;  
}

struct Bid {  
  address from_;  
  uint cost_;  
  bytes32 districtZip_;
  bool failed_;  
}

mapping(address => uint[]) public transactionIndexesToSender;
Transaction[] public transactions;

mapping(address => uint[]) public bidIndexesToSender;
Bid[] private bids;

    function bid(uint _cost, bytes32 _district) public {
        address from_ = msg.sender;  
                uint256 bidId = bids.push(  
        Bid({  
            //contract_:  contract_,  
            from_: from_,  
            cost_: _cost,  
            districtZip_: _district,
            failed_: true  
            })  
        );  
        bidIndexesToSender[from_].push(bidId - 1); 
 
        bids[bidId - 1].failed_ = false;
    }
    
    function transfer(address _to, uint _value, bytes32 _data) public {
        uint codeLength;
        bytes memory empty;
        address from_ = msg.sender;  
        assembly {
            codeLength := extcodesize(_to)
        }

        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        // Check to see if receiver is contract
        if(codeLength>0) {
            ERC223ReceivingContract receiver = ERC223ReceivingContract(_to);
            receiver.tokenFallback(msg.sender, _value, empty);
        }
        emit Transfer(msg.sender, _to, _value);
                uint256 transactionId = transactions.push(  
        Transaction({  
            //contract_:  contract_,  
            to_: _to,  
            amount_: _value,  
            data_: _data,
            failed_: true  
            })  
        );  
        transactionIndexesToSender[from_].push(transactionId - 1); 
        
        emit Transfer(msg.sender, _to, _value);
 
        transactions[transactionId - 1].failed_ = false;
    }
    
    // Overridden Backwards compatible transfer method without _data param
    function transfer(address _to, uint _value) public returns (bool) {
        uint codeLength;
        bytes memory empty;

        require(_value > 0);  
  
        //address contract_ = "";  
  
        assembly {
            codeLength := extcodesize(_to)
        }

        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        // Check to see if receiver is contract
        if(codeLength>0) {
            ERC223ReceivingContract receiver = ERC223ReceivingContract(_to);
            receiver.tokenFallback(msg.sender, _value, empty);
        }
        
    }
}

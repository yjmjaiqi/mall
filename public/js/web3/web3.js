const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
console.log("web3", web3);

var abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_category",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_describe",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_price",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_link",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_limittime",
				"type": "string"
			}
		],
		"name": "addProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "productIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "stores",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "category",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "describe",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "price",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "link",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "starttime",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "limittime",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "enum Supermarket.productStatus",
				"name": "status",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
let User_Accous = [];

web3.eth.getAccounts().then(function (accouts) {
    User_Accous = accouts;
    console.log(User_Accous);
});

var myContract = new web3.eth.Contract(abi, '0xa68570267FCA212f94ae6b0355A12Af1B2399ECb');
//商品信息
$(".stores").click(function(){
	myContract.methods.stores(User_Accous[0],1).call().then(
    function (receipte) {
        console.log("receipt",receipte);
    }
)});
//交易记录
$(".productIndex").click(function(){
	myContract.methods.productIndex().call().then(
    function (receipte) {
        console.log("receipt",receipte);
    }
)});

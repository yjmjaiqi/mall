const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
console.log("web3", web3);

var abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_class",
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
				"name": "_starttime",
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
		"inputs": [
			{
				"internalType": "string",
				"name": "_username",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_password",
				"type": "string"
			}
		],
		"name": "adduser",
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
		"inputs": [],
		"name": "userid",
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
			}
		],
		"name": "usermap",
		"outputs": [
			{
				"internalType": "string",
				"name": "username",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "password",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "useraddress",
				"type": "address"
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

var myContract = new web3.eth.Contract(abi, '0x85A5f851829f83E6b8b9833Bcf88A9563fa45ed6');
//  添加用户（注册）
// var a = 12345
// console.log(a.length)
$("#loginBtn").click(function(){
	document.getElementById("address").value = User_Accous[0]
	console.log("注册凭证",document.getElementById("address").value)
	address = document.getElementById("iden").value
	username = document.getElementById("username").value
	password = document.getElementById("password").value
	console.log(typeof(password),password.length,User_Accous[0],address)
	if(password.length<6 || address != User_Accous[0]){
		return
	}else{
		myContract.methods.adduser(username,password).send({from:User_Accous[0]}).then(
			function (receipte) {
				console.log("receipt",receipte);
			}
		)}
});
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

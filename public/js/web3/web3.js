const web3 = new Web3(Web3.givenProvider || "ws://localhost:8546");
console.log("web3", web3);
var abi = [
	{
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productid",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "Iscompelete",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_buytime",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "__buyer",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "__solder",
				"type": "address"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
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
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_image",
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
		"name": "auctionLimit",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "buyer",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productid",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "contribue",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productIndex",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_useraddress",
				"type": "address"
			}
		],
		"name": "delProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_key",
				"type": "address"
			}
		],
		"name": "get",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "class",
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
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "image",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "starttime",
						"type": "string"
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
				"internalType": "struct Supermarket.Product",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_useraddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getProduct",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "enum Supermarket.productStatus",
				"name": "",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productid1",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "_address1",
				"type": "address"
			}
		],
		"name": "getmoney",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_key",
				"type": "address"
			}
		],
		"name": "getsss",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "class",
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
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "image",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "starttime",
						"type": "string"
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
				"internalType": "struct Supermarket.Product[]",
				"name": "",
				"type": "tuple[]"
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
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "getstores",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "class",
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
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "image",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "starttime",
				"type": "string"
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
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_getuser",
				"type": "address"
			}
		],
		"name": "getuser",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_useraddress",
				"type": "address"
			},
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
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "keys",
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
				"internalType": "uint256",
				"name": "_productid",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "moneyback",
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
				"internalType": "uint256",
				"name": "_productid",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "returnback",
		"outputs": [],
		"stateMutability": "nonpayable",
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
				"name": "class",
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
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "image",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "starttime",
				"type": "string"
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
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			},
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
		"name": "upduser",
		"outputs": [],
		"stateMutability": "nonpayable",
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
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "usermap",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
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
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]
var date = new Date()
date = date.toLocaleDateString()
console.log(date);
let User_Accous = [];
// console.log(timestamp);
web3.eth.getAccounts().then(function (accouts) {
	User_Accous = accouts;
	console.log(User_Accous);
});


var myContract = new web3.eth.Contract(abi, '0x12B7D7AD465bA864e3e57bf2cb9077Fb68326038');

//  添加用户（注册）
// var a = 12345
// console.log(a.length)
$("#loginBtn").click(function () {
	document.getElementById("address").value = User_Accous[0]
	console.log("注册凭证", document.getElementById("address").value)
	address = document.getElementById("iden").value
	username = document.getElementById("username").value
	password = document.getElementById("password").value
	console.log(typeof (password), password.length, User_Accous[0], address)
	if (password.length < 6 || address != User_Accous[0]) {
		return
	} else {
		myContract.methods.adduser(username, password).send({ from: User_Accous[0] }).then(
			function (receipte) {
				console.log("receipt", receipte);
			}
		)
	}
});
// 修改用户
$("#AlterUser").click(function () {
	document.getElementById("address").value = User_Accous[0]
	address = document.getElementById("iden").value
	username = document.getElementById("username").value
	password = document.getElementById("password").value
	console.log(address, User_Accous[0]);
	if (password.length < 6 || address != User_Accous[0]) {
		return
	} else {
		myContract.methods.upduser(address, username, password).send({ from: User_Accous[0] }).then(
			function (receipte) {
				console.log("receipt", receipte);
			}
		)
	}
})
// 添加商品
// block.timestamp
$(".btn").click(function () {
	// document.getElementById("address").value = User_Accous[0]
	category = document.getElementById("category").value
	console.log(category);
	productname = document.getElementById("productname").value
	information = document.getElementById("information").value
	price = document.getElementById("price").value
	start_time = document.getElementById("start_time").value
	end_time = document.getElementById("end_time").value
	inputfile = document.getElementById("inputfile").value
	console.log("category", category, productname, "end_time", typeof (end_time), end_time, "inputfile", inputfile);
	myContract.methods.addProduct(category, productname, information, price, inputfile, start_time, end_time).send({ from: User_Accous[0] }).then(
		function (receipte) {
			console.log("receipt", receipte);
		})
})
//下架商品
// $("#soldout").click(function(){
Array.from(document.getElementsByClassName("id")).forEach(i => {
	i.onclick = function () {
		let i = this.getAttribute("data-id");
		console.log("i", i)
		myContract.methods.delProduct(i, User_Accous[0]).send({
			from: User_Accous[0]
		}).then(
			function (receipte) {
				console.log("receipt", receipte);
			})
		//window.location.href = '/article/page/'+i;
	}
})
// })
//购买商品
Array.from(document.getElementsByClassName("ids")).forEach(i => {
	i.onclick = function () {
		let i = this.getAttribute("data-id").split(":");
		// let id = this.getAttribute("data-id").split(":");
		sellers = document.getElementById("sellers").value
		console.log("i", i[0], i[1], sellers)
		if (document.getElementById("receive_address").value == '') {
			return
		} else {
			myContract.methods.contribue(i[0], sellers).send({
				from: User_Accous[0]
			}).then(
				function (receipte) {
					console.log("receipt", receipte);
				})
		}
		if (document.getElementById("receive_address").value == '') {
			return
		} else {
			web3.eth.sendTransaction({
				from: User_Accous[0],
				to: '0x12B7D7AD465bA864e3e57bf2cb9077Fb68326038',
				value: i[1] * 10 ** 18,
				gas: 1500000,
				gasPrice: 66666
			}).then(function (receipt) {
				console.log(receipt)
				console.log("send seccess")
				//alert("转账成功")
			});
		}
	}
})
//确认收货从合约把托管资金转会卖家
Array.from(document.getElementsByClassName("buyshop")).forEach(i => {
	i.onclick = function () {
		let i = this.getAttribute("data-id").split(":");
		// let id = this.getAttribute("data-id").split(":");
		console.log("i", i[0], i[1])
		sellers = document.getElementById("sellers").value
		buynum = document.getElementById("buynum").value
		// num = document.getElementById("num").value
		// alert(num)
		alert(sellers)
		// alert(buynum)
		myContract.methods.Iscompelete(i[0], sellers).send({
			from: User_Accous[0]
		}).then(
			function (receipte) {
				console.log("receipt", receipte);
			})
		// web3.eth.sendTransaction({
		// 	from: '0x12B7D7AD465bA864e3e57bf2cb9077Fb68326038',
		// 	to: sellers,
		// 	value: i[1] *buynum * 10 ** 18,
		// 	gas: 1500000,
		// 	gasPrice: 66666
		// }).then(function (receipt) {
		// 	console.log(receipt)
		// 	console.log("send seccess")
		// 	//alert("转账成功")
		// });
	}
})
//商品信息
$(".stores").click(function () {
	myContract.methods.stores(User_Accous[0], 1).call().then(
		function (receipte) {
			console.log("receipt", receipte);
		}
	)
});
//交易记录
$(".productIndex").click(function () {
	myContract.methods.productIndex().call().then(
		function (receipte) {
			console.log("receipt", receipte);
		}
	)
});


//查询合约余额
web3.eth.getBalance("0x12B7D7AD465bA864e3e57bf2cb9077Fb68326038")
	.then(console.log);
//查询Metamask钱包余额
web3.eth.getBalance(document.getElementById("myaddress").value)
	.then(console.log);
web3.eth.getBalance(document.getElementById("myaddress").value).then(function (balance) {
	document.getElementById("balance").innerHTML = balance / 10 ** 18;
	console.log("balance", balance / 10 ** 18);
});
// $("#send").click(function(){
//     let tr = document.getElementById("tr").value;
//     console.log(tr);
//     web3.eth.sendTransaction({
//         from: yjmAccous,
//         to: '0x974C9Fda17662D0CD1D30010Cc155b80681f3555',
//         value: tr,
// 		gas : 1500000,
// 		gasPrice:66666
//     }).then(function(receipt){
// 		console.log(receipt)
//         console.log("send seccess")
//         alert("转账成功")
//     });
// })
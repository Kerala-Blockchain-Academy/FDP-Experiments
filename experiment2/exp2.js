var Web3 = require("web3");
const { TransactionFactory } = require("@ethereumjs/tx");

const secp256k1 = require('secp256k1')
const keccak = require('keccak')
const BIP39 = require("bip39")
const hdkey = require('ethereumjs-wallet/hdkey')
const Wallet = require('ethereumjs-wallet')
const keccak256 = require('js-sha3').keccak256;

web3 = new Web3();

let privateKeyF = generateWallet();
console.log(privateKeyF)
buildTransaction(privateKeyF);

function generateWallet() {
    let mnemonic = BIP39.generateMnemonic();
    console.log("******* WALLET *****");
    const seed = BIP39.mnemonicToSeedHex(mnemonic);
    const privateKey = hdkey.fromMasterSeed(seed).derivePath(`m/44'/60'/0'/0`).getWallet().getPrivateKey();
    console.log("Private Key :", Buffer.from(privateKey).toString('hex'));
    const wallet = Wallet.fromPrivateKey(privateKey)
    const pubKey = wallet.getPublicKey();
    const address = keccak256(pubKey);
    let finalAddress = "0x" + address.substring(address.length - 40, address.length);
    console.log("Final Address: ", finalAddress);
    let publicKey = secp256k1.publicKeyCreate(privateKey, false).slice(1);
    console.log('Public Key: ', Buffer.from(publicKey).toString('hex'))
    let blockchainAddress = keccak('keccak256').update(Buffer.from(pubKey)).digest().slice(-20).toString('hex')
    console.log('Address: ', blockchainAddress);
    console.log('***********');
    return "0x" + Buffer.from(privateKey).toString('hex');
}

async function buildTransaction(privateKey) {
    let recipient = '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55';
    let tx = {
        to: recipient,
        gas: 2000000,
        gasPrice: '234567897654321',
        value: '1000000000',
        data: '',
        nonce: 0,
        chainId: 1
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    console.log("Signed trans: ", signedTx);
    console.log("raw trans: ", signedTx.rawTransaction);
    let senderAddress = web3.eth.accounts.recoverTransaction(signedTx.rawTransaction);
    console.log("SenderAddress:", senderAddress);
    recoverPublicKey(signedTx.rawTransaction);
}

function recoverPublicKey(rawTx) {
    const data = Buffer.from(rawTx.slice(2), "hex"); //remove 0x
    console.log("Raw Tx:", rawTx.slice(2));
    console.log("Data: ", data);
    const tx = TransactionFactory.fromSerializedData(data); //recover tx from encoded data.
    console.log("Tx", tx);
    console.log("Public Key:", tx.getSenderPublicKey().toString("hex"));
}

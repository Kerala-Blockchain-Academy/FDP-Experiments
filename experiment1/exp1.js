const { randomBytes } = require('crypto')
const BIP39 = require("bip39")
const hdkey = require('ethereumjs-wallet/hdkey')
const Wallet = require('ethereumjs-wallet')
const keccak256 = require('js-sha3').keccak256;

createAccount();
function createAccount() {
    createAddress(createKeys());

}
function createKeys() {
    let mnemonic = BIP39.generateMnemonic();
    console.log("MNEMONIC: ", mnemonic);
    const seed = BIP39.mnemonicToSeedHex(mnemonic);
    console.log("SEED: ", seed);
    const privateKey = hdkey.fromMasterSeed(seed).derivePath(`m/44'/60'/0'/0`).getWallet().getPrivateKey();
    console.log("Private Key :", Buffer.from(privateKey).toString('hex'));
    const wallet = Wallet.fromPrivateKey(privateKey)
    const pubKey = wallet.getPublicKey();
    console.log("Public Key: ", Buffer.from(pubKey).toString('hex'));
    return pubKey;
}

function createAddress(publicKey) {
    const address = keccak256(publicKey) // keccak256 hash of  publicKey
    let finalAddress = "0x" + address.substring(address.length - 40, address.length);
    console.log("Final Address: ", finalAddress);
}

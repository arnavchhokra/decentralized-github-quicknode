import ABI from "../../../../contract/ABI.json";
import web3Provider from "./web3Provider";

const contractAddress = "0xe0F57B708B6897219d6fFb5A8F1D1c53A7F99665";

const connectContract = async() =>{
    const web3 = await web3Provider();
    if (web3) {
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(ABI, contractAddress);
        return { contract, accounts };
    } else {
        throw new Error("Web3 provider is not available");
    }
}




export default connectContract;



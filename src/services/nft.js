import caver from "../helpers/caver.js";
import Web3 from "web3";
import abi from "../datas/abiEth.js";
import conn from "../db/index.js";
// import config  from "../datas/mainnet.js";
import config from "../datas/testnet.js";

const web3 = new Web3(new Web3.providers.HttpProvider(config.PROVIDER));

const wallet = web3.eth.accounts.wallet.add(config.privateKey);
web3.eth.defaultAccount = wallet.address;

const NFTService = {
  uploadMetadata: async (nftRequest, membershipGrade) => {
    const attributes = Object.keys(nftRequest).map((key) => ({
      trait_type: key,
      value: nftRequest[key],
    }));
    const { image, sameYear, grade, gradeImage, startDate, endDate, term } =
      membershipGrade;

    const metadata = {
      name: "Ideal Farm NFT debenture",
      description: "This is Ideal Farm NFT debenture",
      attributes,
      image,
      gradeImage,
      sameYear,
      grade,
      startDate,
      endDate,
      term,
    };
    const ret = await caver.kas.metadata.uploadMetadata(metadata);
    return ret.uri;
  },

  mintNFT: async ({ uri, nftRequestId, walletAddress }) => {
    try {
      const contract = new web3.eth.Contract(abi, config.CONTRACT);
      const gasAmount = await contract.methods
        .mint(walletAddress, nftRequestId, uri)
        .estimateGas();
      const tx = {
        to: config.CONTRACT,
        gas: gasAmount,
        data: contract.methods
          .mint(walletAddress, nftRequestId, uri)
          .encodeABI(),
      };
      const signed = await web3.eth.accounts.signTransaction(
        tx,
        config.privateKey
      );
      const transactionReceipt = await web3.eth.sendSignedTransaction(
        signed.rawTransaction
      );
      console.log(transactionReceipt);

      return true;
    } catch (error) {
      return false;
    }
  },

  checkMinted: async ({ id }) => {
    const mintingDate = `SELECT invest.mintingDate FROM invest WHERE invest.id = ${id} AND invest.mintingDate IS not NULL`;
    const [[mint]] = await conn.query(mintingDate);
    return !!mint;
  },

  getNFTList: async ({ walletAddress }) => {
    const contract = new web3.eth.Contract(abi, config.CONTRACT);

    const transferTo = await contract.getPastEvents("Transfer", {
      filter: { to: walletAddress },
      fromBlock: 0,
    });
    const transferFrom = await contract.getPastEvents("Transfer", {
      filter: { from: walletAddress },
      fromBlock: 0,
    });
    const fromTokenId = transferTo.map((id) => id.returnValues.tokenId);
    const toTokenId = transferFrom.map((id) => id.returnValues.tokenId);

    toTokenId.forEach((id) => {
      const findTokenId = fromTokenId.indexOf(id);
      if (findTokenId !== -1) {
        fromTokenId.splice(findTokenId, 1);
      }
    });

    const promise = fromTokenId.map(async (id) => {
      try {
        const url = await contract.methods.tokenURI(+id).call();
        const response = await fetch(url);
        const json = await response.json();
        return { metadata: json, tokenId: +id };
      } catch (error) {
        console.error(error);
      }
    });

    const nftData = await Promise.all(promise);

    return nftData;
  },

  getMembershipGrade: async ({ membershipGradeId }) => {
    const query = `SELECT * FROM membershipGrade JOIN membership 
    ON membershipGrade.membershipId = membership.id WHERE membershipGrade.id = ${membershipGradeId}`;
    const [[rows]] = await conn.query(query);

    return rows;
  },

  getNFT: async ({ tokenId }) => {
    const contract = new web3.eth.Contract(abi, config.CONTRACT);
    const url = await contract.methods.tokenURI(+tokenId).call();
    const response = await fetch(url);
    const json = await response.json();
    return { metadata: json, tokenId };
  },
};

export default NFTService;

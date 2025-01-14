import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);

  // check window obj in DOM to see if Phantom extension has injected the SOL object
  // if have SOL obj -> check to see if it's a Phantom wallet
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");

          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "Connected with Public key:",
            response.publicKey.toString()
          );
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect Wallet
    </button>
  );

  // called once on component mount (empty dep arr) -> when user visits app check if they have Phantom wall installed
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">Pixel Squares</p>
          <p className="sub-text">Minimalist art living on Solana</p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && (
            <p>
              <b>Logged in as:</b>
              {walletAddress}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

import React, { useEffect } from "react";
import { useGlobalContext } from "./context";
import "./App.css";
const App = () => {
  const {
    currentAccount,
    connectWallet,
    retrieveFile,
    handleSubmit,
    getAllImages,
    descHandle,
    posts,
    desc,
  } = useGlobalContext();

  useEffect(() => {
    getAllImages();
  }, []);
  console.log(posts);
  return (
    <main>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={retrieveFile} />
        <br />
        <br />
        <input
          type="text"
          name=""
          id=""
          onChange={(e) => descHandle(e)}
          value={desc}
        />
        <br />
        <br />
        <button type="submit">POST</button>
      </form>
      {!currentAccount ? (
        <button onClick={connectWallet}>LOG IN</button>
      ) : (
        <p>{currentAccount}</p>
      )}
      <div>
        {posts.map((item) => {
          const { user, id, filehash, timestamp, desc } = item;
          return (
            <div key={id}>
              <p>{user}</p>
              <p>{timestamp}</p>
              <h3>{desc}</h3>
              <img src={`https://ipfs.infura.io/ipfs/${filehash}`} alt="" />
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default App;

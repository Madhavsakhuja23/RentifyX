import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Messages from "../seller/pages/Messages";

const BuyerMessages = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header />
      <div style={{ flex: 1, overflow: 'hidden', padding: '20px 0' }}>
        <Messages />
      </div>
    </div>
  );
};

export default BuyerMessages;

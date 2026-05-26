import React from "react";
import Header from "../components/Header/Header";
import Messages from "../seller/pages/Messages";

const BuyerMessages = () => {
  return (
    <div className="buyer-messages-page">
      <Header />
      <div className="buyer-messages-inner">
        <Messages />
      </div>
    </div>
  );
};

export default BuyerMessages;

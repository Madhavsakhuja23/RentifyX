import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Messages from "../seller/pages/Messages";

const BuyerMessages = () => {
  return (
    <>
      <Header />
      <div style={{ minHeight: "calc(100vh - 80px)", paddingTop: "20px" }}>
        <Messages />
      </div>
      <Footer />
    </>
  );
};

export default BuyerMessages;

"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

export default function Donate() {
  const wallets = {
    BTC: "bc1q5lkwelezltdmvle34re46n874vfcte3w7clalt",
    ETH: "0x3d7c59724FDEEA2bBDfCF0acc50a0E925F0Bf960",
    LTC: "LgGNginoxMjQYrUet9gm1rPhq2oBweqgxk",
    SOL: "3wmnsafFbxpdru8kZ3ivTp3XWkWJSGAsW2h7UroTQgFX",
    ADA: "addr1qx95yjajsu4293zzu8qsnlgggffpdajkq4mdpysmk5l6mkutgf9m9pe25tzy9cwpp87sssjjzmm9vptk6zfphdfl4hdsa8rrks",
    USDT_TRC20: "TKLWkmyiKzyUDipZb7FYjhsfkKfiCoYk77",
    USDT_ERC20: "0x3d7c59724FDEEA2bBDfCF0acc50a0E925F0Bf960",
    BNB: "0x3d7c59724FDEEA2bBDfCF0acc50a0E925F0Bf960",
  };

  const [qrCodes, setQrCodes] = useState({});

  useEffect(() => {
    Object.entries(wallets).forEach(async ([coin, address]) => {
      const url = await QRCode.toDataURL(address);
      setQrCodes((prev) => ({ ...prev, [coin]: url }));
    });
  }, []);

  return (
    <>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>💚 Support RandomKick</h1>
      <p>Donations help keep the site free. No tracking, no accounts.</p>

      {Object.entries(wallets).map(([coin, address]) => (
        <div
          key={coin}
          style={{
            marginTop: 30,
            padding: 20,
            border: "1px solid #444",
            borderRadius: 8,
          }}
        >
          <h2>{coin}</h2>
          <p>{address}</p>

          {qrCodes[coin] && (
            <img
              src={qrCodes[coin]}
              alt={`${coin} QR`}
              style={{ width: 200, marginTop: 10 }}
            />
          )}
        </div>
      ))}
    </>
  );
}
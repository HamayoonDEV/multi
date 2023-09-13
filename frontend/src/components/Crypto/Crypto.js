import React from "react";
import styles from "./Crypto.module.css";
import { useEffect, useState } from "react";
import { fetchCrypto } from "../../api/external";
import Loading from "../Loading/Loading";

const Crypto = () => {
  const [crypto, setCrypto] = useState([]);
  useEffect(() => {
    (async function getCrypto() {
      try {
        const response = await fetchCrypto();
        setCrypto(response);
      } catch (error) {
        return error;
      }
    })();
  }, []);
  if (crypto.length == 0) {
    return <Loading text={"Loading Crypto"} />;
  }
  return (
    <div className={styles.main}>
      <table>
        <thead>
          <tr>
            <td>#</td>
            <td>Coin</td>
            <td>Symbol</td>
            <td>Price</td>
            <td>24h</td>
          </tr>
        </thead>
        <tbody>
          {crypto.map((crypto) => (
            <tr>
              <td>{crypto.market_cap_rank}</td>
              <td>
                <img src={crypto.image} />
                {crypto.name}
              </td>
              <td>{crypto.symbol}</td>
              <td>{crypto.current_price}</td>
              <td
                className={
                  crypto.price_change_percentage_24h < 0
                    ? styles.negative
                    : styles.positve
                }
              >
                {crypto.price_change_percentage_24h}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Crypto;

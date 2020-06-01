import React, { useState, Suspense } from "react";
import moment from "moment";

import "./styles.css";

export default function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [feeState, setFee] = useState(0);

  const handleSetFee = e => setFee(e.target.value);

  const handleLoadData = async e => {
    e.preventDefault();
    setIsLoading(true);
    return await fetch(
      "https://cors-anywhere.herokuapp.com/https://api.turnip.exchange/islands",
      {
        method: "POST",
        body: JSON.stringify({
          islander: "neither",
          category: "turnips",
          fee: feeState
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(data => {
        setData(data?.islands);
        setIsLoading(false);
      });
  };

  return (
    <div className="App">
      <h1>Turnip Exchange Table</h1>
      <h2>Reloading too often may cause server to not response</h2>
      <br />
      <label>Require Fees: </label>
      <select onChange={handleSetFee} value={feeState}>
        <option value={0}>No</option>
        <option value={1}>Yes</option>
      </select>
      <br />
      <br />
      <button onClick={handleLoadData} disabled={isLoading}>
        Load Islands
      </button>
      <br />
      <br />
      <table style={{ border: "1px solid black", width: "100%" }}>
        <thead style={{ backgroundColor: "lightblue" }}>
          <tr>
            <th>Island Name</th>
            <th>Turnip Price</th>
            <th>Queued</th>
            <th>Rating</th>
            <th>Entry Fee</th>
            <th style={{ width: "650px" }}>Description</th>
            <th>Island Time</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "lightYellow" }}>
          {isLoading && (
            <tr>
              <td>Loading...</td>
            </tr>
          )}
          {!isLoading &&
            data
              .sort((a, b) => b.turnipPrice - a.turnipPrice)
              .map((island, i) => {
                return (
                  <tr key={i}>
                    <td>{island.name}</td>
                    <td>{island.turnipPrice}</td>
                    <td>{island.queued}</td>
                    <td>{island.rating}</td>
                    <td>{island.fee ? "YES" : "NO"}</td>
                    <td>{island.description}</td>
                    <td>{moment(island.islandTime).format("llll")}</td>
                    <td>
                      <a
                        target='_blank"'
                        href={`https://turnip.exchange/island/${
                          island.turnipCode
                        }`}
                      >
                        Link
                      </a>
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
}

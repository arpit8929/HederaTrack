import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const HederaTransactionTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [filteredTransaction, setFilteredTransaction] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchTransactions = async () => {
    try {
      const response = await fetch("https://testnet.mirrornode.hedera.com/api/v1/transactions?limit=30");
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 5000);
    return () => clearInterval(interval);
  }, []);

  const searchTransaction = () => {
    if (!searchId) {
      setErrorMessage("⚠ Please enter a Transaction ID.");
      setFilteredTransaction(null);
      return;
    }

    const foundTransaction = transactions.find(tx => tx.transaction_id === searchId);
    if (foundTransaction) {
      setFilteredTransaction(foundTransaction);
      setErrorMessage("");
    } else {
      setErrorMessage("❌ Transaction not found.");
      setFilteredTransaction(null);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(parseFloat(timestamp) * 1000).toLocaleString();
  };

  const convertToHBAR = (tinybars) => {
    return (tinybars / 100000000).toFixed(8);
  };

  const graphData = transactions.map(tx => ({
    timestamp: formatTimestamp(tx.consensus_timestamp),
    fee: convertToHBAR(tx.charged_tx_fee || 0),
    amount: convertToHBAR(tx.transfers?.filter(t => t.amount > 0).reduce((sum, t) => sum + (t.amount || 0), 0)),
  }));

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>🔍 Hedera Real-Time Transaction Tracker</h2>
      
      <div style={searchBoxContainer}>
        <input
          type="text"
          placeholder="Enter Transaction ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={searchInputStyle}
        />
        <button onClick={searchTransaction} style={searchButtonStyle}>Search</button>
      </div>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {filteredTransaction && (
        <div style={transactionDetailStyle}>
          <h3>🔎 Transaction Details</h3>
          <p><strong>Transaction ID:</strong> {filteredTransaction.transaction_id}</p>
          <p><strong>Account ID:</strong> {filteredTransaction.transfers?.find(t => t.account_id)?.account_id || "N/A"}</p>
          <p><strong>Timestamp:</strong> {formatTimestamp(filteredTransaction.consensus_timestamp)}</p>
          <p><strong>Fee (HBAR):</strong> {convertToHBAR(filteredTransaction.charged_tx_fee || 0)}</p>
          <p><strong>Amount (HBAR):</strong> {convertToHBAR(filteredTransaction.transfers?.filter(t => t.amount > 0).reduce((sum, t) => sum + (t.amount || 0), 0))}</p>
        </div>
      )}

      <div style={tableContainerStyle}>
        <h3>📜 Live Transactions</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Account ID</th>
              <th>Timestamp</th>
              <th>Fee (HBAR)</th>
              <th>Amount (HBAR)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? transactions.map((tx, index) => {
              let accountID = tx.transfers?.find(t => t.account_id)?.account_id || "N/A";
              return (
                <tr key={index}>
                  <td>{tx.transaction_id}</td>
                  <td>{accountID}</td>
                  <td>{formatTimestamp(tx.consensus_timestamp)}</td>
                  <td>{convertToHBAR(tx.charged_tx_fee || 0)}</td>
                  <td>{convertToHBAR(tx.transfers?.filter(t => t.amount > 0).reduce((sum, t) => sum + (t.amount || 0), 0))}</td>
                </tr>
              );
            }) : <tr><td colSpan="5">No transactions available</td></tr>}
          </tbody>
        </table>
      </div>
      
      <div style={graphContainer}>
        <div style={graphBoxStyle}>
          <h4>💸 Amount Trends (HBAR)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graphData}>
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" name="Amount (HBAR)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={graphBoxStyle}>
          <h4>💲 Fee Trends (HBAR)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graphData}>
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="fee" stroke="#82ca9d" name="Fee (HBAR)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const containerStyle = { width: "100%", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", background: "#f4f4f9" };
const titleStyle = { marginTop: "20px", textAlign: "center" };
const searchBoxContainer = { display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" };
const searchInputStyle = { padding: "8px", width: "300px", borderRadius: "5px", border: "1px solid #ccc" };
const searchButtonStyle = { padding: "8px 15px", cursor: "pointer", background: "#007bff", color: "white", border: "none", borderRadius: "5px" };
const tableContainerStyle = { 
  width: "90%", 
  marginTop: "20px" 
};

const tableStyle = { 
  width: "100%", 
  borderCollapse: "collapse", 
  alignItems: "center",
  textAlign: "center",
  background: "#fff", 
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", 
  tableLayout: "fixed"  // Ensures columns adjust properly 
};
const graphContainer = { display: "flex", gap: "20px", justifyContent: "center", width: "80%", marginTop: "20px" };
const graphBoxStyle = { flex: 1, background: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" };
const transactionDetailStyle = { background: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", width: "80%", marginTop: "20px" };


export default HederaTransactionTracker;




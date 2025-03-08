import axios from "axios";

const MIRROR_NODE_API = "https://testnet.mirrornode.hedera.com/api/v1";

export const getTransactions = async (accountId) => {
  try {
    const url = accountId
      ? `${MIRROR_NODE_API}/transactions?account.id=${accountId}`
      : `${MIRROR_NODE_API}/transactions?limit=10`;

    const response = await axios.get(url);
    return response.data.transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

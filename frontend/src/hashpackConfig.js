import { HashConnect } from "hashconnect";

const hashconnect = new HashConnect();

const appMetadata = {
  name: "Hedera Transaction Tracker",
  description: "Track Hedera transactions in real-time",
  icon: "https://example.com/icon.png",
};

export const initHashPack = async () => {
  try {
    // Initialize HashConnect and return the pairing string
    const initData = await hashconnect.init(appMetadata, "testnet", true);

    if (!initData) {
      throw new Error("Failed to initialize HashConnect");
    }

    const { topic, pairingString } = initData;
    
    console.log("Pairing String:", pairingString);
    console.log("Topic:", topic);

    return pairingString;
  } catch (error) {
    console.error("HashPack Initialization Error:", error);
    return null;
  }
};

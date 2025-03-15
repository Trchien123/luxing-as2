// List of valid Seele addresses
const seeleAddressList = [
  "0x8d08aad4b2bac2bb761ac4781cf62468c9ec47b4",
  "0xb0606f433496bf66338b8ad6b6d51fc4d84a44cd",
  "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
  "0x58f56615180a8eea4c462235d9e215f72484b4a3",
  "0x3089df0e2349faea1c8ec4a08593c137da10fe2d",
  "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
  "0x235f10ac97bb9e23984bacadc52f6993b53a24cf",
  "0x1ef75d33baa2047ffe6baf601b7255f8f48f702c",
  "0xc7317c5c439f31e5100d907eabf70b7f3cbc739a",
  "0x04a90964c7c5c4ec1a97e34e426a24ce6dc36659",
  "0x4e6fec28f5316c2829d41bc2187202c70ec75bc7",
  "0x2eaca4958ed323125c5ec63c5e291fbcec01c8d0",
  "0x1fd95a4699e5415387ca8df18973b1a8c0a8300e",
  "0xc5c25a97514f9cbdc04eaf69e4c51f0a3b6e05b2",
];

// Validation functions
export const isValidEthereumAddress = (address) =>
  /^0x[a-fA-F0-9]{40}$/.test(address);

export const isValidSeeleAddress = (address) =>
  seeleAddressList.includes(address.toLowerCase());

export const isValidBitcoinAddress = (address) =>
  /^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,62}$/.test(address);

// Main validation function
export const validateInput = (input, id) => {
  if (!input.trim()) {
    return { isValid: false, error: "⚠ Address cannot be empty!" };
  }

  if (id === "ETH") {
    if (!isValidEthereumAddress(input) && !isValidSeeleAddress(input)) {
      return {
        isValid: false,
        error:
          "❌ Invalid Ethereum or Seelecoin Address ! Please enter a valid one.",
      };
    }
  }

  if (id === "SEL" && !isValidSeeleAddress(input)) {
    return {
      isValid: false,
      error: "❌ Invalid Seele Address! Please enter a valid one.",
    };
  }

  if (id === "BTC" && !isValidBitcoinAddress(input)) {
    return {
      isValid: false,
      error: "❌ Invalid Bitcoin Address! Please enter a valid one.",
    };
  }

  return { isValid: true, error: "" };
};

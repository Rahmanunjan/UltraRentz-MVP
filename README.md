# 🏡 UltraRentz-MVP

**Securing, Protecting, and Monetising Rent Deposits on the Blockchain.**

UltraRentz is a decentralized dApp built with **ethers.js**, **Solidity**, and **React + TypeScript** to protect tenant rent deposits using token payments and multi-signatory approval. Landlords and renters nominate 3 signatories each, with funds only released when **4 of 6** approve — no central authority required.

---

## 🚀 Live Demo

🔗 [ultrarentz.vercel.app](https://ultrarentz.vercel.app) *(Replace with your actual URL after deployment)*

---

## 🧠 Features

- 🧾 **Pay Rent Deposits** using URZ tokens  
- 🖊️ **Multi-signatory system** (4 of 6 must approve for release)  
- 🧍‍♂️🧍‍♀️ Renter and Landlord each nominate 3 signatories  
- 🪙 ERC-20 URZ Token deployed on **Moonbase Alpha**  
- 💳 Choose **fiat** or **token** mode  
- 🌕 MetaMask wallet integration  
- 🌑 Light/Dark mode toggle  
- 📅 Automatic tenancy end date calculation  

---

## 💸 How to Pay with URZ

1. Connect MetaMask wallet to **Moonbase Alpha** network.  
2. Add the **URZ token** manually to MetaMask:
   - Contract: `0xB1c01f7e6980AbdbAec0472C0e1A58EB46D39f3C`
   - Symbol: `URZ`
   - Decimals: `18`
3. Choose "Token" mode in the form.
4. Input:
   - Deposit amount
   - Tenancy start date and duration
   - Landlord wallet address
5. Click **Pay Token**.

---

## ✍️ How to Add Signatories

1. Scroll to the **Signatories Section**.
2. Add 3 emails under **Renter** and **Landlord** sections.
3. Click `Finalize Deposit & Signatories` when:
   - URZ payment is confirmed ✅
   - Wallet is connected
   - All 6 signatories are added

---

## 🛠️ Tech Stack

- Solidity  
- ethers.js  
- React  
- **TypeScript**  
- Vite

 # 🌱 AgriChain – Blockchain Supply Chain Transparency  

AgriChain is a **blockchain-powered supply chain tracking system** for agricultural produce. It ensures **transparency, traceability, and fair pricing** by recording every step — from **farmer → distributor → retailer → customer** — on the blockchain.  
Supporting documents like **quality certificates** are stored securely in **Supabase**. Customers can simply **scan a QR code** to verify product authenticity.  

---

## ✨ Features  
- 👩‍🌾 **Farmer Dashboard** – Create batches, upload certificates, mint blockchain IDs.  
- 🚚 **Distributor Dashboard** – Scan batches, record logistics, verify transfers.  
- 🏬 **Retailer Dashboard** – Accept stock, print QR codes for customers.  
- 🛒 **Customer Portal** – Scan QR code to view **origin, transfers, and certificates**.  
- 🔗 **Blockchain Integration** – Ethereum/Polygon (Hardhat + MetaMask + Ethers.js).  
- 🗄 **Supabase Integration** – Authentication, storage (certificates), and metadata.  

---

## 🛠 Tech Stack  
- **Frontend:** React + TailwindCSS + Ethers.js  
- **Blockchain:** Solidity + Hardhat + MetaMask  
- **Backend:** Supabase (Auth, Postgres DB, Storage)  
- **QR Codes:** `qrcode.react`  

---

## 🔄 Workflow  


---

## 📂 Project Structure  

frontend/
├── src/
│ ├── components/ # UI components (Navbar, QRScanner, etc.)
│ ├── pages/ # Landing, Farmer, Distributor, Retailer, Customer
│ ├── services/ # supabase.js, blockchain.js
│ ├── App.js
│ └── index.js
└── tailwind.config.js

contracts/
├── SupplyChain.sol # Smart contract
├── hardhat.config.js
└── scripts/
├── deploy.js
└── interact.js

supabase/
├── schema.sql # Tables: profiles, batches, transfers
├── policies.sql # RLS policies


---

 

🔒 Security & Trust

Blockchain → Immutable record of transfers.

Supabase RLS (Row-Level Security) → Farmers/distributors can only manage their own data.

Public QR Access → Customers read-only access (no login).

📌 Roadmap

✅ Farmer/Distributor/Retailer dashboards

✅ Supabase integration (Auth, DB, Storage)

✅ Blockchain contract (Hardhat + MetaMask)

🔲 Multi-chain deployment (Polygon, Optimism)


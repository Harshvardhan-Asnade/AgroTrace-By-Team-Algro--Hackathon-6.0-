
# 🌱 AgroTrace: Trust in Every Bite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**AgroTrace** is a modern, full-stack web application that brings unparalleled transparency and traceability to the agricultural supply chain. By leveraging blockchain for immutable transaction records and Supabase for robust data and document management, AgroTrace empowers stakeholders at every level—from farmers to consumers—to verify the journey of their food.



---

## ✨ Core Features

-   **👤 Role-Based Dashboards**: Tailored interfaces for Farmers, Distributors, and Retailers to manage their specific tasks in the supply chain.
-   **🔗 Blockchain Integration**: Every critical step—from batch creation to final transfer—is recorded on the blockchain, ensuring an immutable and auditable history.
-   🗄️ **Secure Data & Document Management**: Supabase handles user authentication, stores batch metadata, and manages related documents like quality certificates in secure cloud storage.
-   **🤖 GenAI-Powered Smart Contract Auditing**: An admin-only tool that uses generative AI to create and suggest robust Solidity smart contracts for supply chain management, accelerating development and ensuring best practices.
-   **📱 QR Code Tracing for Consumers**: End consumers can scan a simple QR code on product packaging to view the complete, transparent history of their food, from farm to shelf.
-   **Modern & Responsive UI**: Built with Next.js, Tailwind CSS, and ShadCN UI for a sleek, fast, and accessible user experience on any device.

---

## 🔄 End-to-End Workflow

AgroTrace creates a seamless and transparent flow of information:

1.  **👩‍🌾 Farmer**:
    -   Registers an account and logs into their dashboard.
    -   Creates a new produce batch, which mints a unique ID on the blockchain.
    -   Uploads batch metadata (e.g., harvest date, origin) and quality certificates to Supabase.

2.  **🚚 Distributor**:
    -   Logs in and views incoming shipments from farmers.
    -   Scans a batch ID to verify its origin and details.
    -   Accepts the transfer, creating a new transaction on the blockchain and updating the history in Supabase.

3.  **🏬 Retailer**:
    -   Logs in and accepts incoming shipments from distributors.
    -   Marks batches as "Available for Purchase," making them visible to consumers.
    -   Generates and prints QR codes to be placed on product packaging.

4.  **🛒 Customer**:
    -   Scans the QR code with their smartphone (no login required).
    -   Instantly views a public trace page showing the full journey: farmer details, transfer history, locations, timestamps, and associated quality certificates.

---

## 🛠 Tech Stack

AgroTrace is built with a modern, powerful, and scalable technology stack:

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Frontend**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
-   **AI/Generative**: [Google AI & Genkit](https://firebase.google.com/docs/genkit)
-   **Backend & Database**: [Supabase](https://supabase.com/) (Auth, Postgres, Storage)
-   **Blockchain Interaction**: [Ethers.js](https://ethers.io/), [MetaMask](https://metamask.io/)

---

## 🚀 Getting Started

To run this project locally, you'll need to have Node.js and npm installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/agrotrace.git
    cd agrotrace
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    -   Create a file named `.env.local` in the root of the project.
    -   Add your Supabase URL and public anonymous key to this file:
        ```env
        NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
        NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
        GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
        ```

4.  **Set up the Supabase database:**
    -   Log in to your Supabase project.
    -   Go to the **SQL Editor** and run the SQL script located in `supabase/schema.sql` to create the necessary tables and policies.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running at `http://localhost:9002`.

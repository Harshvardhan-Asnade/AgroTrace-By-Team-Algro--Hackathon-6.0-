# **App Name**: AgriTrace

## Core Features:

- Produce Registration: Farmers can register their produce, specifying details such as origin, planting date, expected harvest date. They must specify how many items are in a 'lot'.
- Blockchain Tracking: Each lot of produce is assigned a unique identifier and is recorded on a blockchain as it moves through the supply chain (distribution, retail).
- Transaction Verification: Stakeholders (distributors, retailers) can verify transactions and update the produce's location on the blockchain using Metamask.
- QR Code Access: Consumers can scan a QR code on the product to view its journey, including origin, handling, and certifications.
- Smart Contract Audit Tool: Generate suggested smart contracts using generative AI, for an administrator to review as a tool, before writing them to the blockchain.
- Transparency Report Generator: Allow any end user to select one lot, and then view the properties of that lot on screen, along with all its verified steps between creation and reception.
- Landing Page: Project introduction, features, 'Trace Your Food' button. CTA for Login/Register.
- Authentication: Login / Register (via Supabase Auth). Assign role (farmer, distributor, retailer, customer) at registration or by admin. Logout clears Supabase session + disconnects wallet.
- Farmer Dashboard: Create new produce batch (mint NFT on blockchain). Upload quality/organic certificates (Supabase). See own batches + QR codes.
- Distributor Dashboard: View incoming shipments from farmers. Transfer produce to retailers. Track logistics.
- Retailer Dashboard: Accept produce from distributor. Manage stock. Show customers QR code scanning option.
- Customer Interface: Scan QR code to trace produce origin. View history (farm → distributor → retailer). Leave feedback (optional).

## Style Guidelines:

- Primary color: Earthy green (#6B8E23) to represent agriculture and nature.
- Background color: Light beige (#F5F5DC) for a neutral and organic feel.
- Accent color: Warm orange (#FFA500) to highlight key information and CTAs.
- Body and headline font: 'PT Sans', a humanist sans-serif for a modern but welcoming feel.
- Use clear, consistent icons to represent different stages of the supply chain.
- Keep the layout clean and intuitive, with a focus on easy navigation and scannability.
- Use subtle transitions and animations to enhance user experience and provide feedback.
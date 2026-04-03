# Elemental Wars — NFT Staking Frontend

A React-based web interface for staking [Elemental Wars](https://elementalwars.io) NFTs on the WAX blockchain. Users authenticate with Google, connect a WAX wallet, and stake NFTs from the `elementalwar` AtomicAssets collection by transferring them to the staking account.

---

## Features

- Google OAuth login for user identification
- WAX wallet connection via **WAX Cloud Wallet** or **Anchor Wallet**
- Fetches all Elemental Wars NFTs owned by the connected wallet
- Displays NFT name, rarity, asset ID, and ability
- One-click staking: transfers the NFT on-chain and records it via the backend API
- Shows currently staked NFTs alongside unstaked ones

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| UI          | React 17, Bootstrap 5               |
| Blockchain  | WAX (via `@waxio/waxjs`)            |
| Wallet      | Anchor Link + Browser Transport     |
| NFT Data    | AtomicAssets API                    |
| Auth        | Google OAuth (`react-google-login`) |
| HTTP        | Axios                               |
| Build       | Create React App                    |

---

## Getting Started

### Prerequisites

- Node.js ≥ 14
- npm ≥ 6
- A WAX mainnet account with Elemental Wars NFTs
- A running instance of the [Elemental Wars staking backend](https://elementalwarsapi.xyz) (or a local equivalent)

### Install

```bash
git clone https://github.com/JumboMiller/Staking-EW.git
cd Staking-EW
npm install
```

### Configuration

The backend URL and Google OAuth client ID are currently hardcoded in `src/App.js`. Before running or deploying, update these values:

| Variable         | Location in `src/App.js`                         | Description                        |
|------------------|--------------------------------------------------|------------------------------------|
| `server`         | `const server = "https://elementalwarsapi.xyz/"` | Backend API base URL               |
| `clientId`       | `clientId="81457948776-..."`                     | Google OAuth 2.0 client ID         |

> For a production setup, move these into environment variables using `.env` and `REACT_APP_` prefixes (CRA convention).

### Run (development)

```bash
npm start
```

Opens at [http://localhost:3000](http://localhost:3000). The page reloads on file changes.

---

## Usage

1. Open the app in a browser.
2. Sign in with Google — this associates your email with staked NFTs.
3. Connect your WAX wallet (WAX Cloud Wallet or Anchor).
4. The app fetches all NFTs in the `elementalwar` collection owned by your wallet.
5. Click **Staking** on any card to stake that NFT:
   - The NFT is transferred on-chain to `3e4wo.wam`
   - The staking record is posted to the backend API
6. Already-staked NFTs are shown with an **Already Staked** label and are non-interactive.

---

## Project Structure

```
src/
├── App.js          # Main component — auth, wallet, NFT fetch, stake logic
├── Modal.js        # Reusable modal overlay for status messages
├── css/
│   └── App.css     # All custom styles (layout, NFT cards, buttons)
├── fonts/          # Custom fonts
├── img/            # Static images (NFT backgrounds, UI assets)
└── index.js        # React entry point

public/
└── index.html      # App shell; page title set to "Elemental Wars Staking"
```

---

## Scripts

| Command           | Description                                      |
|-------------------|--------------------------------------------------|
| `npm start`       | Start development server at `localhost:3000`     |
| `npm run build`   | Build optimized production bundle to `build/`    |
| `npm test`        | Run tests in interactive watch mode              |
| `npm run eject`   | Eject CRA config (irreversible)                  |

---

## Deployment

Build the static assets and serve them from any static host (Netlify, Vercel, S3, etc.):

```bash
npm run build
# Deploy the contents of build/ to your hosting provider
```

The app is a pure client-side SPA. No server-side rendering is required.

> Ensure the backend API (`server` URL) is accessible from the deployment environment and that the Google OAuth client ID is authorized for the production origin.

---

## License

<!-- TODO: Add license information -->


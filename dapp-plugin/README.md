# WingRiders Wallet dApp plugin

The WingRiders Wallet dApp plugin can be used by dApps to inject [CIP-0030](https://developers.cardano.org/docs/governance/cardano-improvement-proposals/cip-0030/) compatible API into the browser. If you are a dApp and you want to integrate WingRiders Wallet, you can follow these easy steps:

1. Install `@wingriders/wallet-dapp-plugin` package:

```sh
npm install @wingriders/wallet-dapp-plugin
```

2. Initialize the plugin:

```ts
import {
  initWrWalletDappPlugin,
  WrWalletInitMode,
} from "@wingriders/wallet-dapp-plugin";

const connectWingRidersWallet = () => {
  initWrWalletDappPlugin({
    mode: WrWalletInitMode.SINGLE_NETWORK,
    network: "preprod",
    cabServerUrl: "https://cab-server.preprod.wingriders.com",
    gatewayUrl: "https://wallet.wingriders.com",
  });

  const wallet = window.cardano.wrWallet; // follows the CIP-0030 Wallet API
};
```

3. Use the injected wallet API:

After injecting the wallet API, you can use it just as any another Cardano wallet according to the [CIP-30](https://cips.cardano.org/cip/CIP-30) standard:

```ts
// get the CBOR API by calling .enable()
const api = await window.cardano.wrWallet.enable();

// get list of utxos
const utxos = await api.getUtxos();

// get balance - ADA and tokens
const balance = await api.getBalance();

// get list of used addresses
const usedAddresses = await api.getUsedAddresses();

// get collateral
const collateral = await api.getCollateral();

// sign a transaction
const signature = await api.signTx(tx);

// submit a transaction
const submittedTx = await api.submitTx(signedTx);
```

4.  Disconnect the WingRiders Wallet

After user disconnects the wallet on your side, you should call `disconnectWrWallet()` to properly clear all data and disconnect the WingRiders wallet:

```ts
import { disconnectWrWallet } from "@wingriders/wallet-dapp-plugin";

const onWalletDisconnect = () => {
  // ... your logic for disconnecting wallet
  disconnectWrWallet();
};
```

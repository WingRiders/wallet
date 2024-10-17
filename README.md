# WingRiders Wallet

WingRiders Wallet is a open-source, one-click wallet for Cardano that doesn't need any browser extensions and works in all browsers and platforms. The wallet consists of two parts:

1. Wallet dApp plugin
2. Seed phrase gateway website

## Wallet dApp plugin

The Wallet dApp plugin can be used by dApps to inject [CIP-0030](https://developers.cardano.org/docs/governance/cardano-improvement-proposals/cip-0030/) compatible API into the browser. If you are a dApp and you want to integrate WingRiders Wallet, you can follow these easy steps:

1. Install `@wingriders/wallet-dapp-plugin` package:

```sh
npm install @wingriders/wallet-dapp-plugin
```

> Please note that the plugin hasn't been published to NPM yet so the command above will not work just yet.

2. Initialize the plugin:

```ts
import { initDappPlugin } from "@wingriders/wallet-dapp-plugin";

const connectWingRidersWallet = () => {
  initDappPlugin({
    gatewayUrl: "https://wallet.wingriders.com",
    cabBackendUrlByNetwork: {
      preprod: "https://cab-server.preprod.wingriders.com",
      mainnet: "https://cab-server.mainnet.wingriders.com",
    },
  });

  const wallet = window.cardano.wrWallet; // follows the CIP-0030 Wallet API
};
```

## Development

This project uses bun, if you don't have it installed at your machine, you can install it by following the instructions at https://bun.sh/.

### Install dependencies

```
bun install
```

### Run tests

```
bun run test
```

### Check formatting and linting

```
bun run check
```

### Fix formatting and linting

```
bun run fix
```

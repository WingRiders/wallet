# WingRiders Wallet

WingRiders Wallet is an open-source, one-click wallet for Cardano that works across all browsers and platforms without the need for browser extensions. The wallet is composed of two key components:

1. [Wallet dApp plugin](./dapp-plugin/README.md) - Enables dApps to integrate with the WingRiders Wallet.
2. [Wallet Gateway application](./gateway/README.md) - Used for managing the wallet and communicating with dApps.

For more detailed information, please refer to the respective sections above.

## Development setup

This project uses [Bun](https://bun.sh/). If you don't have Bun installed, you can follow the installation guide on their website.

### Installing dependencies

```
bun install
```

### Running tests

```
bun run test
```

### Checking formatting and linting

```
bun run check
```

### Fixing formatting and linting issues

```
bun run fix
```

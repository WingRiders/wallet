# Wallet milestone 1

This guide shows how to verify that the implemented wallet API returns mocked data.

## Prerequisites

- Bun is installed on your machine (https://bun.sh/)
- Git is installed on your machine (https://git-scm.com/)

## Steps

### 1. Clone the wallet repository

```sh
git clone git@github.com:WingRiders/wallet.git

# switch to the cloned directory
cd wallet
```

### 2. Install dependencies

```sh
bun install
```

### 3. Run the dapp-plugin test suite

```sh
cd dapp-plugin
bun run test
```

### 4. Verify that the test suite passes

The output of the test command should indicate that the passed:

```
✓ inject > injected CBOR API returns correct data
```

This means, that the injected wallet API returned mocked data.

You can review the test file [here](https://github.com/WingRiders/wallet/blob/8dd73c2501898b4a2acf507f625384eda8d79d75/dapp-plugin/test/init/inject.spec.ts) and the mocked data [here](https://github.com/WingRiders/wallet/blob/8dd73c2501898b4a2acf507f625384eda8d79d75/dapp-plugin/test/mocks/values.ts).

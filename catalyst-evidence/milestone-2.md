# Wallet milestone 2

This guide shows how to run the wallet gateway locally and verify that it works.

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

### 3. Build the gateway application

```sh
cd gateway
bun run build
```

### 4. Copy environment variables

```sh
cp .env.example .env
```

### 5. Run the gateway application

```sh
bun run dev
```

The window with the gateway application should open automatically - http://localhost:5173/

### 6. Create a new wallet

First, change the network to PREPROD and enter your mnemonic. We've prepared a testing wallet that you can use:

```
run short fit drop trigger verify pulse hazard inhale car average priority quantum merry agree
```

After that, enter a new password and create the wallet.

### 7. Verify data on the home page

Verify that you can see your balance, address and list of tokens in your wallet.

### 8. Create collateral

Click on the `SET COLLATERAL` button and enter your password. You should see hash of the transaction where the collateral was created.

# Wallet milestone 3

This guide shows how to verify the communication between a dApp and the WingRiders wallet gateway. For this purpose, we'll use the example application that we've built: https://wallet-example-app.wingriders.com

## Steps

### 1. Create a new wallet in the wallet gateway

(You can skip this step if you have already created a new wallet in the wallet gateway)

Visit https://wallet.wingriders.com.

First, change the network to PREPROD and enter your mnemonic. We've prepared a testing wallet that you can use:

```
run short fit drop trigger verify pulse hazard inhale car average priority quantum merry agree
```

After that, enter a new password and create the wallet.

You can now close this window.

### 2. Use the example application to connect to the WingRiders wallet

Visit https://wallet-example-app.wingriders.com and click on the `CONNECT WINGRIDERS WALLET` button. You will be redirected to the gateway application where you can accept the connection request.

After the wallet is created, you can use the example application to:

- view your balance
- view your address
- view your UTxOs
- create an example transactions

### 3. Create an example transaction

After you connect to the WingRiders wallet in the example application, click on the `CREATE EXAMPLE TRANSACTION` button. This action will built a transaction where you will send 2 ADA to yourself.

After the transaction is built, you will be redirected to the gateway application, where you can sign the transaction.

After the transaction is signed, the example application should show the hash of the submitted transaction.

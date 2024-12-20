# Wallet milestone 3

This guide shows how to verify the communication between a dApp and the WingRiders wallet gateway. For this purpose, we'll use the example application that we've built: https://wallet-example-app.wingriders.com

## Steps

### 1. Create a new wallet in the wallet gateway

(You can skip this step if you have already created a new wallet in the wallet gateway)

Visit https://wallet.wingriders.com.

Either restore your existing wallet or create a new one. This wallet should have some funds if you want to test the transactions.

After that, enter a new password and create the wallet.

You can now close this window.

### 2. Use the example application to connect to the WingRiders wallet

Visit https://wallet-example-app.wingriders.com and click on the `CONNECT WINGRIDERS WALLET` button. You will be redirected to the gateway application where you can accept the connection request.

After the wallet is connected, you can use the example application to:

- view your balance
- view your address
- view your UTxOs
- create an example transaction

### 3. Create an example transaction

After you connect to the WingRiders wallet in the example application, click on the `CREATE EXAMPLE TRANSACTION` button. This action will build a transaction which sends 2 ADA to yourself.

After the transaction is built, you will be redirected to the gateway application, where you can sign the transaction.

After the transaction is signed, the example application should show the hash of the submitted transaction.

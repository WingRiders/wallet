export enum WrWalletInitMode {
  /**
   * Use if your dApp is working with a single network.
   * If user tries to connect with a wallet that is not on the selected network, the connection will be rejected.
   */
  SINGLE_NETWORK = 'single-network',
  /**
   * Use if your dApp is working with multiple networks based on the network from the connected wallet.
   */
  MULTI_NETWORK = 'multi-network',
}

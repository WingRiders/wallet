# Definitions
This file contains definitions related to the WingRiders wallet.

- ## Launchpad creation:
      Given Located in Launchpadd tab
      * Wallet is connected
      * User has enough funds (at least 500 ADA)
      When User clicks "Create a new launch"
      * Fills out required details (Launch title, Decription, Link to detailed information, Tokenomics link, Marketing image)
      * Adds socials if available
      * Adds additional details if available
      * Clicks "Continue"
      * Selects asset
      * Sets quantity
      * Clicks "Continue"
      * Chooses token to be raised + min and max to raise
      * Chooses percentage for liquidity pool raise with slider (min 15%)
      * Chooses number of tokens for tokens committed to liquidity pool
      * Checks countries wished to exclude
      * Clicks "Continue"
      * Adds Min contribution and date
      * Adds NFT or WRT holders tiers if desired
      * Chooses Contribution end date
      * Clicks "Continue"
      * Checks Overview details
      * Clicks "Sign transactions"
      * Clicks "Sign" on Create starter UTxO
      * Checks box with terms and conditions and confirms creating starter UTxO
      * Signs transaction in wallet
      * Clicks "Sign" on Launch configuration and contracts (Confirm launch creation window pops up)
      * Checks details and clicks "Confirm"
      * Signs transaction in wallet (Transaction submited window pops up)
      * Clicks "Sign" on Rewards fold validator contract (Confirm launch creation window pops up)
      * Checks details and clicks "Confirm" 
      * Signs transaction in wallet (Transaction submited window pops up)
      * Clicks "Sign" on Node validator contract (Confirm launch creation window pops up)
      * Checks details and clicks "Confirm" 
      * Signs transaction in wallet (Transaction submited window pops up)
      * Clicks "Sign" on Head and tokens holder UTxOs (Confirm launch initialization window pops up)
      * Checks details and clicks "Confirm" 
      * Signs transaction in wallet (Transaction submited window pops up)
      * Clicks "Sign" on Separator nodes (Confirm inserting separator nodes window pops up)
      * Checks details and clicks "Confirm" 
      * Signs transaction in wallet (Transaction submited window pops up)
      Then User is redirected to overview of the project
      * Details are correct and hyperlinks 
      * Your transaction was confirmed on the blockchain window pops up
      * Creation is visible in transaction history
      * Cancel button is visible on the bottom of the launchpad overview
      * Project is visible in Launchpad directory                    
- ## Launchpool cancel:
        Given Located in Launchpad tab
        * Wallet is conencted
        * Launchpool is created and visible
        * Launchpool hasnt started yet
        * Cancel button is visible on the bottom of the launchpad overview
        When User clicks on Cancel button
        * Confirm launch cancellation window pops up
        * Clicks "Confirm"
        * Transaction in wallet pops up
        * Signs transaction
        Then Launch cancellation submitted window pops up
        * "Cancelled" label is shown near the launchpad title (in both launchpad list and launchpad detail page)  
        * Cancel button is not visible / not enabled  
        * Reclaim button is visible / enabled  
- ## Add liquidity v1/v2:
      When User tries to Add liquidity
      * Manage liquidity window pops up
      * Enters asset value 
      * Second value is computed with correct ratio
      * Clicks "ADD LIQUIDITY"
      * Confirm adding liquidity window pops up
      * User checks details and clicks "Confirm"
      * Wallet transaction window pops up
      * Signs transaction
      Then Value of assets changes accordingly
      * Add liquidity request window pops up
      * Transaction submitted window pops up
      * Your transaction was confirmed on the blockchain pops up
- ## Add liquidity to stableswap:
      When User tries to Add liquidity
      * Manage liquidity window pops up
      * Enters asset value 
      * Second value is computed with correct ratio
      * Clicks "ADD LIQUIDITY"
      * Confirm adding liquidity window pops up
      * User checks details and clicks "Confirm"
      * Wallet transaction window pops up
      * Signs transaction
      Then Value of assets changes accordingly
      * Add liquidity request window pops up
      * Transaction submitted window pops up
      * Your transaction was confirmed on the blockchain pops up
- ## Add liquidity to stableswap with Zap-in:
      When User tries to Add liquidity with Zap-In option
      * Manage liquidity window pops up
      * Enters asset value 
      * Second value is not required or can be custom
      * Clicks "ADD LIQUIDITY"
      * Confirm adding liquidity window pops up
      * User checks details and clicks "Confirm"
      * Wallet transaction window pops up
      * Signs transaction
      Then Value of assets changes accordingly
      * Add liquidity request window pops up
      * Transaction submitted window pops up
      * Your transaction was confirmed on the blockchain pops up
- ## Remove liquidity:
      When User tries to MANAGE
      * Manage liquidity window pops up
      * User clicks on "Remove liquidity"
      * User types his value or uses slider/predetermined value that is lower than before
      * Clicks "Remove liquidity"
      * Confirm removing liquidity window pops up
      * Checks details
      * Confirms
      * Wallet transaction window pops up
      * Signs transaction
      Then Value of assets changes accordingly
      * Transaction submitted window pops up
      * Your transaction was confirmed on the blockchain pops up
- ## Remove whole liquidity:
      When User tries to MANAGE
      * Manage liquidity window pops up
      * User clicks on "Remove liquidity"
      * User types his 100% value or uses slider/predetermined value 
      * Clicks "Remove liquidity"
      * Confirm removing liquidity window pops up
      * Checks details
      * Confirms
      * Wallet transaction window pops up
      * Signs transaction
      Then Value of assets changes accordingly
      * Transaction submitted window pops up
      * Your transaction was confirmed on the blockchain pops up
- ## Remove liquidity with Zap-out:
      When User tries to MANAGE
      * Manage liquidity window pops up
      * User clicks on "Remove liquidity"
      * User chooses asset to remove
      * User types his value or uses slider/predetermined value that is lower than before
      * Clicks "Remove liquidity"
      * Confirm removing liquidity window pops up
      * Checks details
      * Confirms
      * Wallet transaction window pops up
      * Signs transaction
      Then Value of assets changes accordingly
      * Transaction submitted window pops up
      * Your transaction was confirmed on the blockchain pops up
- ## Pool creation:
      Given User has enough funds
      * Pool hasnt been created yet
      When User tries to create a pool
      * Uses new pair
      * Clicks "Create new pool"
      * Confirms creation of new ppol
      * Wallet transaction window pops up
      * Signs transaction
      Then User has created a new pool
- ## Migrate pool:
      Given V1 pool was already created (pair mus be available as V2)
      When User goes back to Liquidity-pools 
      * Migrate pool is signalized
      * User tries to migrate pool
      Then Migration window pops up
      * User confirms migration
      * Pool gets migrated
- ## Token swap:
      When User tries to swap
      * Confirm swap window pops up
      * User checks details and clicks swap
      * Confirms
      * Wallet transaction window pops up
      * Signs transaction
      Then New token will appear on the wallet
      * Swap request submitted window pops up
      * Your transaction was confirmed on the blockchain pops up
      * This transaction is visible in transaction history
- ## Limit order:
      Given Pro mode is enabled
      * User chooses any pair
      * User inputs his desired values of assets for trade
      * User chooses deadline
      When User tries to swap
      * Confirm swap window pops up
      * User checks details and clicks swap
      * Confirms
      * Wallet transaction window pops up
      * Signs transaction
      Then Swap request submitted window pops up
      * Your transaction was confirmed on the blockchain pops up
      * Your interaction was compleated window pops up
      * This transaction is visible in pending transactions until condition is met or deadline ends
- ## Pro mode swap:
      Given Pro mode is enabled
      * User chooses any pair
      * User inputs his desired values of assets for trade
      * User chooses deadline
      * User chooses new slippage
      When User tries to swap
      * Confirm swap window pops up
      * User checks details and clicks swap
      * Confirms
      * Wallet transaction window pops up
      * Signs transaction
      Then New token will appear on the wallet
      * Swap request submitted window pops up
      * Your transaction was confirmed on the blockchain pops up
      * Your interaction was compleated window pops up
      * This transaction is visible in transaction history
- ## Create a proposal :     
      Given Wallet is connected and has enough funds
      * User is in Governance->Voting tab
      When User tries to Create a proposal
      * Fills up the form
      * Clicks "Create proposal"
      * Wallet transaction window pops up
      * Signs transaction
      Then Proposal is created
      * Proposal can be seen in Voting dashboard
- ## Create collateral:                         
      Given Wallet has enough funds
      * User is in Home tab
      When User tries to "CREATE COLLATERAL"
      * Signs transaction
      Then Collateral is created
      * User can use swap etc.
- ## Mint demo tokens:
      Given User has created collateral
      * User is in Home tab
      When User tries to "MINT DEMO TOKENS"
      * Signs transaction
      Then Demo tokens are received on the wallet
- ## Reclaim:
      Given Wallet is connected
      * User has unsuccessful or pending transaction
      * User is in Transactions->Pending tab
      When User clicks "Reclaim"
      * Signs Transaction
      Then Users transaction is reclaimed
      * Funds are visible in the wallet
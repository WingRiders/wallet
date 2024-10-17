import {useQuery} from '@apollo/client'
import {Grid2, Stack, Typography} from '@mui/material'
import {AdaAsset} from '@wingriders/cab/constants'
import {assetId} from '@wingriders/cab/helpers'
import {tokenToAsset} from '@wingriders/cab/ledger/assets'
import {CollateralPanel} from '../../collateral/CollateralPanel'
import {AssetQuantityDisplay} from '../../components/AssetQuantityDisplay'
import {Page} from '../../components/Page'
import {assetsMetadataQuery} from '../../metadata/queries'
import {useWalletDataStore} from '../../store/walletData'
import {Section} from './Section'
import {useWalletValue} from './helpers'

export const HomePage = () => {
  const walletData = useWalletDataStore((s) => s.walletData)

  const walletValue = useWalletValue(walletData)

  // prefetch metadata of all assets in the wallet
  useQuery(assetsMetadataQuery, {
    variables: walletValue
      ? {assets: walletValue.tokenBundle.map(tokenToAsset)}
      : undefined,
  })

  return (
    <Page showHeader>
      <Typography variant="h3">Your wallet overview</Typography>

      {walletValue && walletData && (
        <Stack spacing={3} mt={2}>
          <Section>
            <Typography variant="h4">
              <AssetQuantityDisplay
                token={{...AdaAsset, quantity: walletValue.coins}}
              />
            </Typography>
          </Section>

          <Section title="Address">
            <Typography variant="body1">
              {walletData.usedAddresses[0]}
            </Typography>
          </Section>

          <Section title="Collateral">
            <CollateralPanel />
          </Section>

          <Section title="Tokens">
            <Grid2 container>
              {walletValue.tokenBundle
                .sort((a, b) => b.quantity.comparedTo(a.quantity))
                .map((token) => (
                  <Grid2 size={4} key={assetId(token)}>
                    <AssetQuantityDisplay token={token} />
                  </Grid2>
                ))}
            </Grid2>
          </Section>
        </Stack>
      )}
    </Page>
  )
}

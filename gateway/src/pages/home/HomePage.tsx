import {useQuery} from '@apollo/client'
import {Box, Grid2, Stack} from '@mui/material'
import {AdaAsset} from '@wingriders/cab/constants'
import {assetId} from '@wingriders/cab/helpers'
import {tokenToAsset} from '@wingriders/cab/ledger/assets'
import {AssetQuantityDisplay} from '../../components/AssetQuantityDisplay'
import {Button} from '../../components/Buttons/Button'
import {Page} from '../../components/Page'
import {Paper} from '../../components/Paper'
import {TokenDisplay} from '../../components/TokenDisplay'
import {Heading} from '../../components/Typography/Heading'
import {Label} from '../../components/Typography/Label'
import {assetsMetadataQuery} from '../../metadata/queries'
import {useWalletDataStore} from '../../store/walletData'
import {Section} from './Section'
import {useWalletValue} from './helpers'

export const HomePage = () => {
  const utxos = useWalletDataStore(({utxos}) => utxos)
  const walletValue = useWalletValue(utxos)

  // prefetch metadata of all assets in the wallet
  useQuery(assetsMetadataQuery, {
    variables: walletValue
      ? {assets: walletValue.tokenBundle.map(tokenToAsset)}
      : undefined,
  })

  return (
    <Page showHeader headerProps={{showWallet: true}}>
      <Paper
        title="Your wallet"
        topRightButton={
          <Box>
            <Button
              size="small"
              color="secondary"
              anchor
              href="https://app.wingriders.com/swap"
              target="_blank"
              rel="noreferrer"
            >
              Swap
            </Button>
          </Box>
        }
      >
        {walletValue && (
          <Stack spacing={3} mt={2}>
            <Section>
              <Heading variant="h1">
                <AssetQuantityDisplay
                  token={{...AdaAsset, quantity: walletValue.coins}}
                />
              </Heading>
            </Section>

            <Section title="Tokens">
              {walletValue.tokenBundle.length === 0 ? (
                <Label variant="large">No tokens</Label>
              ) : (
                <Grid2 container spacing={2}>
                  {walletValue.tokenBundle
                    .sort((a, b) => b.quantity.comparedTo(a.quantity))
                    .map((token) => (
                      <Grid2 size={{xs: 12, sm: 6, md: 4}} key={assetId(token)}>
                        <TokenDisplay token={token} />
                      </Grid2>
                    ))}
                </Grid2>
              )}
            </Section>
          </Stack>
        )}
      </Paper>
    </Page>
  )
}

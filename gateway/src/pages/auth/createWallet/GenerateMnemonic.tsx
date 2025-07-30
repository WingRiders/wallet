import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {Box, Checkbox, FormControlLabel, Grid2, Stack} from '@mui/material'
import {generateMnemonic} from '@wingriders/cab/crypto'
import {useState} from 'react'
import {useShallow} from 'zustand/shallow'
import {TextButton} from '../../../components/Buttons/TextButton'
import {FlowNavigation} from '../../../components/FlowNavigation'
import {Label} from '../../../components/Typography/Label'
import {Paragraph} from '../../../components/Typography/Paragraph'
import {WithClipboard} from '../../../components/WithClipboard'
import {useCreateWalletStore} from '../../../store/createWallet'

const MNEMONIC_WORD_COUNT = 24

export const GenerateMnemonic = () => {
  const [generatedMnemonic, setGeneratedMnemonic] = useState<string>()
  const [isUnderstandChecked, setIsUnderstandChecked] = useState(false)

  const {reset: resetCreateWalletStore, submitMnemonic} = useCreateWalletStore(
    useShallow(({reset, submitMnemonic}) => ({
      reset,
      submitMnemonic,
    })),
  )

  const handleGenerateMnemonic = () => {
    setGeneratedMnemonic(generateMnemonic(MNEMONIC_WORD_COUNT))
  }

  const onSubmit = () => {
    if (!generatedMnemonic) return
    submitMnemonic(generatedMnemonic, true)
  }

  return (
    <Box>
      <Box
        p={4}
        sx={({palette}) => ({
          bgcolor: palette.background.paper,
        })}
      >
        {generatedMnemonic ? (
          <Grid2 container spacing={2} p={5}>
            {generatedMnemonic.split(' ').map((word, index) => (
              <Grid2 key={index} size={{xs: 6, sm: 4, md: 3}}>
                <Label variant="large">
                  {index + 1}. {word}
                </Label>
              </Grid2>
            ))}
          </Grid2>
        ) : (
          <Stack
            height={195}
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <TextButton
              onClick={handleGenerateMnemonic}
              icon={<VisibilityIcon fontSize="small" />}
            >
              Reveal mnemonic
            </TextButton>

            <Paragraph sx={{textAlign: 'center'}}>
              Make sure you are in a secure environment and no one is watching
            </Paragraph>
          </Stack>
        )}
      </Box>
      {generatedMnemonic && (
        <Box mt={3} textAlign="end">
          <WithClipboard text={generatedMnemonic}>
            {({copy, isCopied}) => (
              <TextButton
                onClick={copy}
                color="secondary"
                p={0}
                uppercase={false}
                icon={<ContentCopyIcon fontSize="small" />}
              >
                {isCopied ? 'Copied' : 'Copy mnemonic'}
              </TextButton>
            )}
          </WithClipboard>
        </Box>
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={isUnderstandChecked}
            onChange={(e) => setIsUnderstandChecked(e.target.checked)}
          />
        }
        label="I have written down my seed phrase and I understand that WingRiders cannot recover it."
        sx={{mt: 3}}
        disabled={!generatedMnemonic}
      />

      <FlowNavigation
        backButtonOptions={{
          label: 'Back',
          onClick: resetCreateWalletStore,
        }}
        nextButtonOptions={{
          label: 'Continue',
          onClick: onSubmit,
          disabled: !generatedMnemonic || !isUnderstandChecked,
        }}
      />
    </Box>
  )
}

import {Box, Button, Checkbox, FormControlLabel} from '@mui/material'
import {generateMnemonic} from '@wingriders/cab/crypto'
import {useState} from 'react'
import {useShallow} from 'zustand/shallow'
import {FlowNavigation} from '../../../components/FlowNavigation'
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
    submitMnemonic(generatedMnemonic)
  }

  return (
    <Box>
      <Box
        sx={({palette}) => ({
          bgcolor: palette.background.paper,
          p: 2,
        })}
      >
        {generatedMnemonic ?? (
          <Button variant="text" onClick={handleGenerateMnemonic}>
            Reveal mnemonic
          </Button>
        )}
      </Box>

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

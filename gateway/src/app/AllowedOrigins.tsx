import DeleteIcon from '@mui/icons-material/Delete'
import {Stack} from '@mui/material'
import {useState} from 'react'
import {IconButton} from '../components/Buttons/IconButton'
import {Label} from '../components/Typography/Label'
import {Paragraph} from '../components/Typography/Paragraph'
import {useCreatedWalletStore} from '../store/createdWallet'
import {DeleteAllowedOriginConfirmationModal} from './DeleteAllowedOriginConfirmationModal'

export const AllowedOrigins = () => {
  const [deletingOrigin, setDeletingOrigin] = useState<string | null>(null)
  const allowedOrigins = useCreatedWalletStore((s) => s.allowedOrigins)

  if (allowedOrigins.length === 0)
    return <Paragraph>No connected dApps</Paragraph>

  return (
    <>
      <Stack spacing={4}>
        {allowedOrigins.map((origin) => (
          <Stack
            key={origin}
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Label>{origin}</Label>
            <IconButton
              icon={<DeleteIcon />}
              onClick={() => setDeletingOrigin(origin)}
            />
          </Stack>
        ))}
      </Stack>

      {deletingOrigin && (
        <DeleteAllowedOriginConfirmationModal
          open={!!deletingOrigin}
          onClose={() => setDeletingOrigin(null)}
          origin={deletingOrigin}
        />
      )}
    </>
  )
}

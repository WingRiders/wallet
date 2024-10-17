import type {TextFieldProps} from '@mui/material'
import type {FieldError} from 'react-hook-form'

export const getErrorMessage = (fieldError: FieldError) => {
  if (fieldError.type === 'required') return 'This field is required'
  return fieldError.message
}

export const getTextFieldErrorFields = (
  fieldError: FieldError | undefined,
): Pick<TextFieldProps, 'error' | 'helperText'> => {
  return {
    error: fieldError != null,
    helperText: fieldError != null ? getErrorMessage(fieldError) : undefined,
  }
}

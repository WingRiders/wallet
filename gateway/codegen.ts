import type {CodegenConfig} from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    [`${process.env.VITE_API_SERVER_URL_PREPROD || 'https://api.preprod.wingriders.com'}/graphql`]:
      {
        headers: {
          'user-agent': 'graphql-codegen',
        },
      },
  },
  documents: ['src/**/*.ts', 'src/**/*.tsx'],
  generates: {
    'src/graphql/generated/': {
      preset: 'client',
      plugins: [],
    },
  },
}

export default config

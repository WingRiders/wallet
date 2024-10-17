import type {CodegenConfig} from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    'https://api.mainnet.wingriders.com/graphql': {
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

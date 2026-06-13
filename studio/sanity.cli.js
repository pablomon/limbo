import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '6ikhc7g5',
    dataset: 'production'
  },
  deployment: {
    appId: 'mgs7dat2w2c1lwy1v7qqxg2a',
    autoUpdates: false,
  }
})

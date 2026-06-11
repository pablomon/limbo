import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '86i1g2pv',
    dataset: 'production'
  },
  deployment: {
    /**
     * Auto-updates disabled: we deploy via git/Vercel, so the studio bundle
     * should be self-contained and not fetch an update manifest at build time
     * (that network step fails in CI).
     */
    autoUpdates: false,
  }
})

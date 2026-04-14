import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schema } from './src/sanity/schemaTypes'

export default defineConfig({
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'p0s5q05l',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  title: 'Pickleball B2B AI CMS',
  schema,
  plugins: [
    structureTool(),
  ],
})

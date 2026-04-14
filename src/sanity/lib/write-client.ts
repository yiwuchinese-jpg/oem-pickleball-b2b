import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // 写入端永远不用 CDN
  token: process.env.SANITY_API_TOKEN,
})

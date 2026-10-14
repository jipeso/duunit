import { z } from 'zod'

import { requiredText, MAX_TEXT_LENGTH } from './common.ts'

export const MAX_DESCRIPTION_LENGTH = 10000

const MAX_LIST_ITEMS = 5

const ListSchema = z.array(z.string().trim()).max(MAX_LIST_ITEMS)

export const AnalyzeDescriptionSchema = z.object({
  description: requiredText(MAX_DESCRIPTION_LENGTH),
})

export const DescriptionAnalysisSchema = z.object({
  position: z.string().trim().max(MAX_TEXT_LENGTH),
  company: z.string().trim().max(MAX_TEXT_LENGTH),
  location: z.string().trim().max(MAX_TEXT_LENGTH).nullable(),
  salary: z.string().trim().max(MAX_TEXT_LENGTH).nullable(),
  deadline: z.iso.date().nullable().catch(null),
  tasks: ListSchema,
  requirements: ListSchema,
})

export type AnalyzeDescription = z.infer<typeof AnalyzeDescriptionSchema>
export type DescriptionAnalysis = z.infer<typeof DescriptionAnalysisSchema>

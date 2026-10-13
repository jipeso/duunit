import { z } from 'zod'

import { requiredText, MAX_TEXT_LENGTH } from './common.ts'

export const MAX_DESCRIPTION_LENGTH = 10000

const MAX_LIST_ITEMS = 5
const MAX_LIST_ITEM_LENGTH = 80

const DATE_PATTERN = /^20[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/

const ListSchema = z
  .array(z.string().trim().max(MAX_LIST_ITEM_LENGTH))
  .max(MAX_LIST_ITEMS)

export const AnalyzeDescriptionSchema = z.object({
  description: requiredText(MAX_DESCRIPTION_LENGTH),
})

export const DescriptionAnalysisSchema = z.object({
  position: z.string().trim().max(MAX_TEXT_LENGTH),
  company: z.string().trim().max(MAX_TEXT_LENGTH),
  location: z.string().trim().max(MAX_TEXT_LENGTH).nullable(),
  salary: z.string().trim().max(MAX_TEXT_LENGTH).nullable(),
  deadline: z.string().regex(DATE_PATTERN).nullable(),
  tasks: ListSchema,
  requirements: ListSchema,
})

export type AnalyzeDescription = z.infer<typeof AnalyzeDescriptionSchema>
export type DescriptionAnalysis = z.infer<typeof DescriptionAnalysisSchema>

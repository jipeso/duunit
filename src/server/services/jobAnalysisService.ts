import { z } from 'zod'

import { LLM_URL } from '../util/config.ts'
import {
  type AnalyzeDescription,
  type DescriptionAnalysis,
  DescriptionAnalysisSchema,
} from '#common/types/jobAnalysis.ts'

const MAX_OUTPUT_TOKENS = 400
const TEMPERATURE = 0.3

const systemPrompt = (
  today: string
) => `You read a job description and fill in a job application form.

Rules:
- Only use the information in the job description, do not invent or guess any fields. If something is not very clearly specified in the description, mark the fields as empty with null, e.g. "salary": null or "location": null.

Fields:
- position: the job title only, without the company or location.
- company: the name of the hiring company, not a recruitment agency or job website.
- location: the city or place of work.
- salary: the pay.
- deadline: the last day to apply, as YYYY-MM-DD. Today is ${today}.
- tasks: the most important tasks of the job, as phrases copied from the job description.
- requirements: the most important things the applicant must have, like skills, experience and languages, as phrases copied from the job description. Leave out optional things like "a plus", "nice to have" or "is an advantage".`

const CompletionSchema = z.object({
  choices: z.tuple([z.object({ message: z.object({ content: z.string() }) })]),
})

const analyzeDescription = async (
  { description }: AnalyzeDescription,
  signal: AbortSignal
): Promise<DescriptionAnalysis> => {
  const today = new Date().toISOString().slice(0, 10)

  const response = await fetch(new URL('chat/completions', LLM_URL), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      temperature: TEMPERATURE,
      max_tokens: MAX_OUTPUT_TOKENS,
      response_format: {
        type: 'json_schema',
        json_schema: { schema: z.toJSONSchema(DescriptionAnalysisSchema) },
      },
      chat_template_kwargs: { enable_thinking: false },
      messages: [
        { role: 'system', content: systemPrompt(today) },
        { role: 'user', content: description },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(
      `LLM request failed: ${String(response.status)} ${await response.text()}`
    )
  }

  const completion = CompletionSchema.safeParse(await response.json())

  if (!completion.success) {
    throw new Error(`Invalid LLM response: ${completion.error.message}`)
  }

  const result = DescriptionAnalysisSchema.safeParse(
    JSON.parse(completion.data.choices[0].message.content)
  )

  if (!result.success) {
    throw new Error(`Invalid job description analysis: ${result.error.message}`)
  }

  return result.data
}

export default {
  analyzeDescription,
}

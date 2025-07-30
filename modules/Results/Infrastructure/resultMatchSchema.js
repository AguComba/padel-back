import { z } from 'zod'

const winnerMatchSchema = z.object({
  id: z.number().int(),
  id_couple1: z.number().int().nullable(),
  points_couple1: z.number().int().nullable(),
  id_couple2: z.number().int().nullable(),
  points_couple2: z.number().int().nullable(),
})

const loserMatchSchema = z.object({
  id: z.number().int(),
  id_couple1: z.number().int().nullable(),
  points_couple1: z.number().int().nullable(),
  id_couple2: z.number().int().nullable(),
  points_couple2: z.number().int().nullable(),
})

export const resultMatchSchema = z.object({
  first_set_couple1: z.number().int().optional().nullable(),
  first_set_couple2: z.number().int().optional().nullable(),
  second_set_couple1: z.number().int().optional().nullable(),
  second_set_couple2: z.number().int().optional().nullable(),
  third_set_couple1: z.number().int().optional().nullable(),
  third_set_couple2: z.number().int().optional().nullable(),
  winner_couple: z.number().int(),
  result_string: z.string().min(1),
  wo: z.number().int().optional().default(0), // 0 o 1
  id_match: z.number().int(),
  user_created: z.number().int(),
  user_updated: z.number().int(),
  match_type: z.enum(['zona', 'cuadro']),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  winnerNextMatch: winnerMatchSchema.optional(),
  loserNextMatch: loserMatchSchema.optional()
})

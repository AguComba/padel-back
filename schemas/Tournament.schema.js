import { z } from 'zod'

export const TournamentSchema = z.object({
  name: z.string({ message: 'El nombre no es valido' }).min(3).max(50),
  id_federation: z.number({ message: 'La federación no es válida' }),
  date_start: z.date({ message: 'La fecha de inicio no es válida' }),
  date_inscription_start: z.date({ message: 'La fecha de inicio de inscripción no es válida' }),
  date_inscription_end: z.date({ message: 'La fecha de fin de inscripción no es válida' }),
  max_couples: z.number({ message: 'El número de parejas no es válido' }),
  afiliation_required: z.number({ message: 'La afiliación no es válida' }),
  type_tournament: z.enum(['PARTICULAR', 'FEDERADO', 'MASTER']),
  categories: z.array(
    z.object({
      id_category: z.number(),
      genere: z.enum(['M', 'F', 'L', 'M/F']),
    }),
  ),
  //   .nonempty({ message: 'Debe haber al menos una categoría' }),
})

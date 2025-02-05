import { z } from 'zod'

export const TournamentSchema = z.object({
    name: z.string({ message: 'El nombre no es valido' }).min(3).max(50),
    id_federation: z.number({ message: 'La federación no es válida' }),
    date_start: z.date({ message: 'La fecha de inicio no es válida' }),
    date_end: z.date({ message: 'La fecha de fin no es válida' }),
    date_inscription_start: z.date({ message: 'La fecha de inicio de inscripción no es válida' }),
    date_inscription_end: z.date({ message: 'La fecha de fin de inscripción no es válida' }),
    max_couples: z.number({ message: 'El número de parejas no es válido' }),
    afiliation_required: z.number({ message: 'La afiliación no es válida' }),
    type_tournament: z.enum(['PARTICULAR', 'FEDERADO', 'MASTER']),
    gender: z.enum(['M', 'F', 'O']),
    amount: z.number().positive({ message: 'El numero debe ser positivo' }),
    type_amount: z.enum(['AFILIACION', 'INSCRIPCION']),
    categories: z.array(
        z.object({
            id_category: z.number()
        })
    ),
    clubs: z.array(
        z.object({
            id_club: z.number(),
            main_club: z.number()
        })
    )
    //   .nonempty({ message: 'Debe haber al menos una categoría' }),
})

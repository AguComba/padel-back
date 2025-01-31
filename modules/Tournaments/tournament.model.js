import { handleTransaction } from '../../utils/transactions.js'

export class TournamentModel {
    static async create(tournament) {
        return await handleTransaction(async (connection) => {
            // Desestructurar categorías del objeto torneo.
            const { categories, clubs, ...tournamentData } = tournament

            // Crear el torneo.
            const [rows] = await connection.query(
                `INSERT INTO tournaments 
        (name, id_federation, date_start, date_end, date_inscription_start, date_inscription_end, max_couples, gender,afiliation_required,
        type_tournament, user_created, user_updated) 
        VALUES (?, ?,?,?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    tournamentData.name,
                    tournamentData.id_federation,
                    tournamentData.date_start,
                    tournamentData.date_end,
                    tournamentData.date_inscription_start,
                    tournamentData.date_inscription_end,
                    tournamentData.max_couples,
                    tournamentData.gender,
                    tournamentData.afiliation_required,
                    tournamentData.type_tournament,
                    tournamentData.user_created,
                    tournamentData.user_created
                ]
            )

            if (rows.affectedRows === 0) {
                throw new Error('No se pudo crear el torneo')
            }

            const idTournament = rows.insertId

            // Crear las categorías asociadas al torneo.
            const categoriesData = categories.map((category) => [
                idTournament,
                category.id_category,
                tournamentData.user_created
            ])
            const clubsData = clubs.map((club) => [
                idTournament,
                club.id_club,
                club.main_club,
                tournamentData.user_created
            ])

            const [rowsCategories] = await connection.query(
                `INSERT INTO tournament_categories(id_tournament, id_category, user_created) VALUES ?`,
                [categoriesData]
            )

            if (rowsCategories.affectedRows === 0) {
                throw new Error('No se pudieron crear las categorías del torneo')
            }

            const [rowsTournamentClub] = await connection.query(
                `INSERT INTO tournament_clubs(id_tournament, id_club, main_club, user_created) VALUES ?`,
                [clubsData]
            )

            if (rowsTournamentClub.affectedRows === 0) {
                throw new Error('No se pudieron crear los clubes del torneo')
            }
            // Retornar el torneo creado con sus categorías.
            return { id: idTournament, ...tournament, categories, clubs }
        })
    }
}

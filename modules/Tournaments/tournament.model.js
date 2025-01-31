import { executeQuery } from '../../utils/executeQuery.js'
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

    static async search() {
        try {
            const rows =
                await executeQuery(`SELECT t.id, t.name, date_start, date_end, date_inscription_start, date_inscription_end, t.max_couples,
                    t.gender, club.name as club, c.name as ciudad
                    FROM tournaments t
                    INNER JOIN tournament_clubs t_club ON t_club.id_tournament = t.id
                    INNER JOIN clubs club ON t_club.id_club = club.id
                    INNER JOIN cities c ON club.id_city = c.id
                    WHERE t.status = 1 AND t_club.main_club = 1
                `)
            return rows.shift()
        } catch (error) {
            throw new Error(error)
        }
    }

    static async searchCategories(id) {
        try {
            const rows = await executeQuery(
                `SELECT c.name, c.level FROM tournament_categories tc
                INNER JOIN categories c ON c.id = tc.id_category
                WHERE id_tournament = ?`,
                [id]
            )
            return rows
        } catch (error) {
            throw new Error(error)
        }
    }
}

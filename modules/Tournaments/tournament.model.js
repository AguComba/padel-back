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
          tournamentData.user_created,
        ],
      )

      if (rows.affectedRows === 0) {
        throw new Error('No se pudo crear el torneo')
      }

      const idTournament = rows.insertId

      // Crear las categorías asociadas al torneo.
      const categoriesData = categories.map((category) => [idTournament, category.id_category, tournamentData.user_created])
      const clubsData = clubs.map((club) => [idTournament, club.id_club, club.main_club, tournamentData.user_created])

      const [rowsCategories] = await connection.query(`INSERT INTO tournament_categories(id_tournament, id_category, user_created) VALUES ?`, [categoriesData])

      if (rowsCategories.affectedRows === 0) {
        throw new Error('No se pudieron crear las categorías del torneo')
      }

      const [rowsTournamentClub] = await connection.query(`INSERT INTO tournament_clubs(id_tournament, id_club, main_club, user_created) VALUES ?`, [clubsData])

      if (rowsTournamentClub.affectedRows === 0) {
        throw new Error('No se pudieron crear los clubes del torneo')
      }

      const [rowsTournamentAmoutn] = await connection.query(`INSERT INTO amounts(type_amount, amount, id_tournament) VALUES (?,?,?)`, [tournamentData.type_amount, tournamentData.amount, idTournament])

      if (rowsTournamentAmoutn.affectedRows === 0) {
        throw new Error('No se pudieron crear los clubes del torneo')
      }
      // Retornar el torneo creado con sus categorías.
      return { id: idTournament, ...tournament, categories, clubs }
    })
  }

  static async search() {
    try {
      const rows = await executeQuery(`SELECT t.id, t.name, date_start, date_end, date_inscription_start, date_inscription_end, t.max_couples,
                    t.gender, club.name as club, c.name as ciudad, a.amount
                    FROM tournaments t
                    INNER JOIN amounts a ON a.id_tournament = t.id
                    INNER JOIN tournament_clubs t_club ON t_club.id_tournament = t.id
                    INNER JOIN clubs club ON t_club.id_club = club.id
                    INNER JOIN cities c ON club.id_city = c.id
                    WHERE t.status = 1 AND t_club.main_club = 1
                    AND CURDATE() <= t.date_end
                `)
      return rows
    } catch (error) {
      throw new Error(error)
    }
  }
  static async searchAll() {
    try {
      const rows = await executeQuery(`SELECT t.id, t.name, date_start, date_end, date_inscription_start, date_inscription_end, t.max_couples,
                    t.gender, club.name as club, c.name as ciudad, a.amount, 
                    CASE WHEN CURDATE() <= t.date_end THEN true ELSE false END as is_active
                    FROM tournaments t
                    INNER JOIN amounts a ON a.id_tournament = t.id
                    INNER JOIN tournament_clubs t_club ON t_club.id_tournament = t.id
                    INNER JOIN clubs club ON t_club.id_club = club.id
                    INNER JOIN cities c ON club.id_city = c.id
                    WHERE t.status = 1 AND t_club.main_club = 1
                `)
      return rows
    } catch (error) {
      throw new Error(error)
    }
  }

  static async searchById(id_tournament) {
    try {
      const tournament = await executeQuery(`SELECT t.id, t.name, date_start, date_end, date_inscription_start, date_inscription_end, t.max_couples,
                    t.gender, club.name as club, c.name as ciudad, a.amount, t.afiliation_required
                    FROM tournaments t
                    INNER JOIN amounts a ON a.id_tournament = t.id
                    INNER JOIN tournament_clubs t_club ON t_club.id_tournament = t.id
                    INNER JOIN clubs club ON t_club.id_club = club.id
                    INNER JOIN cities c ON club.id_city = c.id
                    WHERE t.status = 1 AND t_club.main_club = 1 AND t.id = ?
                    `)
      return tournament.shift()
    } catch (error) {
      throw new Error()
    }
  }

  static async searchCategories(id) {
    try {
      const rows = await executeQuery(
        `SELECT c.name, c.level FROM tournament_categories tc
                INNER JOIN categories c ON c.id = tc.id_category
                WHERE id_tournament = ?`,
        [id],
      )
      return rows
    } catch (error) {
      throw new Error(error)
    }
  }

  static async searchTournamentByCategoryPlayer(category, tournament_id, gender) {
    try {
      const tournament = await executeQuery(
        `SELECT t.id, t.name, date_start, date_end, date_inscription_start, date_inscription_end, 
          t.max_couples, t.gender, club.name as club, c.name as ciudad, 
          cat.id as id_category, cat.name as categoria
          FROM tournaments t
          INNER JOIN tournament_clubs t_club ON t_club.id_tournament = t.id
          INNER JOIN tournament_categories t_cat ON t_cat.id_tournament = t.id
          INNER JOIN category_restrictions cat_res ON cat_res.id_category = t_cat.id_category
          INNER JOIN categories cat ON cat.id = cat_res.id_category
          INNER JOIN clubs club ON t_club.id_club = club.id
          INNER JOIN cities c ON club.id_city = c.id
          WHERE t.status = 1 
            AND t_club.main_club = 1 
            AND cat_res.id_authorized_category = ? 
            AND t.id = ?
            AND cat_res.category_gender = t.gender
            AND cat_res.authorized_category_gender = ?
                `,
        [category, tournament_id, gender],
      )
      return tournament.shift()
    } catch (error) {}
  }
}

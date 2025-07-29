import {executeQuery} from '../../utils/executeQuery.js'
import {handleTransaction} from '../../utils/transactions.js'

export class TournamentModel {
	static async create(tournament) {
		return await handleTransaction(async (connection) => {
			// Desestructurar categorías del objeto torneo.
			const {categories, clubs, ...tournamentData} = tournament

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
				]
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
			return {id: idTournament, ...tournament, categories, clubs}
		})
	}

	static async search() {
		try {
			const rows = await executeQuery(`SELECT t.id, t.name, date_start, date_end, date_inscription_start, date_inscription_end, t.max_couples, t.ranked,
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

	static async isUserInscribed(tournamentId, userId) {
		try {
			const [result] = await executeQuery(
				`SELECT i.id AS inscription_id
         FROM inscriptions i
         INNER JOIN couples c ON i.id_couple = c.id
         INNER JOIN players p1 ON c.id_player1 = p1.id
         LEFT JOIN players p2 ON c.id_player2 = p2.id
         WHERE i.id_tournament = ?
           AND (p1.id_user = ? OR p2.id_user = ?)
           AND i.status_payment = 'PAID'`, // Puedes ajustar el estado si necesitas incluir inscripciones no pagas
				[tournamentId, userId, userId]
			);

			return result ? result.inscription_id : false;
		} catch (error) {
			console.error('Error checking user inscription:', error);
			throw new Error('Error checking user inscription');
		}
	}

	static async searchAll() {
		try {
			const rows = await executeQuery(`SELECT t.id, t.name, date_start, date_end, date_inscription_start, date_inscription_end, t.max_couples,
                    t.gender, club.name as club, c.name as ciudad, a.amount, t.ranked, t.public,
                    CASE WHEN CURDATE() <= t.date_end THEN true ELSE false END as is_active
                    FROM tournaments t
                    INNER JOIN amounts a ON a.id_tournament = t.id
                    INNER JOIN tournament_clubs t_club ON t_club.id_tournament = t.id
                    INNER JOIN clubs club ON t_club.id_club = club.id
                    INNER JOIN cities c ON club.id_city = c.id
                    WHERE t.status = 1 AND t_club.main_club = 1
					ORDER BY t.date_start DESC
                `)
			return rows
		} catch (error) {
			throw new Error(error)
		}
	}

	static async searchById(id_tournament) {
		try {
			const tournament = await executeQuery(`SELECT t.id, t.name, date_start, date_end, date_inscription_start, date_inscription_end, t.max_couples,
                    t.gender, club.id as id_club ,club.name as club, c.name as ciudad, a.amount, t.afiliation_required
                    FROM tournaments t
                    INNER JOIN amounts a ON a.id_tournament = t.id
                    INNER JOIN tournament_clubs t_club ON t_club.id_tournament = t.id
                    INNER JOIN clubs club ON t_club.id_club = club.id
                    INNER JOIN cities c ON club.id_city = c.id
                    WHERE t.status = 1 AND t_club.main_club = 1 AND t.id = ?
                    `, [id_tournament])
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
				[id]
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
            ORDER BY cat.id DESC
                `,
				[category, tournament_id, gender]
			)
			return tournament.shift()
		} catch (error) {}
	}

	static async searchByPlayer(id_user) {
		const rows = await executeQuery(
			`SELECT 
	t.id AS id_torneo,
	i.id AS id_inscripcion,
    t.name AS torneo,
	t.gender, 
    c2.name AS categoria, 
    t.date_end, 
    i.created_at AS "fecha inscripcion",
    COALESCE(CONCAT(u_comp.name, ' ', u_comp.last_name), '') AS compañero,
	c.points as "puntos obtenidos"
	FROM users u
	INNER JOIN players p ON p.id_user = u.id
	INNER JOIN couples c ON (c.id_player1 = p.id OR c.id_player2 = p.id)
	LEFT JOIN players p_comp ON (p_comp.id = c.id_player1 OR p_comp.id = c.id_player2) AND p_comp.id <> p.id
	LEFT JOIN users u_comp ON u_comp.id = p_comp.id_user
	INNER JOIN inscriptions i ON c.id = i.id_couple 
	INNER JOIN tournaments t ON t.id = i.id_tournament
	INNER JOIN tournament_categories tc ON tc.id_tournament = t.id 
	INNER JOIN category_restrictions cr ON tc.id_category = cr.id_category 
	INNER JOIN categories c2 ON cr.id_category = c2.id
	WHERE u.id = ?
	AND cr.id_authorized_category = p.id_category 
	AND cr.category_gender = t.gender 
	AND cr.authorized_category_gender = u.gender
	AND i.status_payment = 'PAID'
	ORDER BY t.date_end DESC`,
			[id_user]
		)
		return rows
	}

	static async isMainClubUser(id_tournament, id_user) {
		const result = await executeQuery(
			`SELECT EXISTS (
    			SELECT 1
    			FROM users u 
    			INNER JOIN user_club uc ON u.id = uc.id_user
    			INNER JOIN tournament_clubs t ON t.id_club = uc.id_club
   		 		WHERE t.id_tournament = ? AND u.id = ? AND t.main_club
 		 	) AS is_creator;`,
			[id_tournament, id_user]
		);

		return !!result[0].is_creator;
	}
	
	static async changeVisualization(data) {
		const result = await executeQuery(
			`UPDATE tournaments SET public = ? WHERE id = ?;`,
			[data.public, data.id]
		);

		return result;
	}


}

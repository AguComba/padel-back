import {executeQuery} from "../../../utils/executeQuery.js"
import {handleTransaction} from "../../../utils/transactions.js"
import ResultMatchRepository from "../Domain/ResultMatchRepository.js"

class ResultMatchRepositoryMysql extends ResultMatchRepository {
  async save(resultMatch) {
    return await handleTransaction(async (connection) => {
      const now = new Date()

      const upsertQuery = `
      INSERT INTO result_match (
        first_set_couple1, first_set_couple2,
        second_set_couple1, second_set_couple2,
        third_set_couple1, third_set_couple2,
        winner_couple, result_string, wo, id_match,
        match_type, created_at, updated_at,
        user_created, user_updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        first_set_couple1 = VALUES(first_set_couple1),
        first_set_couple2 = VALUES(first_set_couple2),
        second_set_couple1 = VALUES(second_set_couple1),
        second_set_couple2 = VALUES(second_set_couple2),
        third_set_couple1 = VALUES(third_set_couple1),
        third_set_couple2 = VALUES(third_set_couple2),
        winner_couple = VALUES(winner_couple),
        result_string = VALUES(result_string),
        wo = VALUES(wo),
        updated_at = VALUES(updated_at),
        user_updated = VALUES(user_updated)
    `

      const values = [
        resultMatch.first_set_couple1,
        resultMatch.first_set_couple2,
        resultMatch.second_set_couple1,
        resultMatch.second_set_couple2,
        resultMatch.third_set_couple1,
        resultMatch.third_set_couple2,
        resultMatch.winner_couple,
        resultMatch.result_string,
        resultMatch.wo ?? 0,
        resultMatch.id_match,
        resultMatch.match_type,
        resultMatch.created_at || now,
        resultMatch.updated_at || now,
        resultMatch.user_created,
        resultMatch.user_updated,
      ]

      await connection.query(upsertQuery, values)

      const updateNextMatch = async (next) => {
        const q = `
        UPDATE matches
        SET id_couple1 = ?, points_couple1 = ?,
            id_couple2 = ?, points_couple2 = ?,
            updated_at = NOW()
        WHERE id = ?
      `
        const {id, id_couple1, points_couple1, id_couple2, points_couple2} = next
        await connection.query(q, [id_couple1, points_couple1, id_couple2, points_couple2, id])
      }

      if (resultMatch.winnerNextMatch) await updateNextMatch(resultMatch.winnerNextMatch)
      if (resultMatch.loserNextMatch) await updateNextMatch(resultMatch.loserNextMatch)

      return {success: true}
    })
  }

  async findById(id) {
    const results = await executeQuery(
      "SELECT * FROM result_match WHERE id = ?",
      [id]
    )
    return results[0]
  }

  async findByMatchId(id_match) {
    const results = await executeQuery(
      "SELECT * FROM result_match WHERE id_match = ?",
      [id_match]
    )
    return results[0]
  }

  async findAllMatchsByZone({zone, category, id_tournament}) {
    const results = await executeQuery(
      `select r.* from matches m
        inner join result_match r on m.id = r.id_match
        where r.match_type = 'zona' and m.zone = ? and m.id_category = ? and m.id_tournament = ?;`,
      [zone, category, id_tournament]
    )
    return results
  }

  async findMatchsByUserLargador({id_user, id_tournament, is_creator_or_admin}) {

    const query = is_creator_or_admin ? `select m.*,
      r.first_set_couple1,
      r.first_set_couple2,
      r.second_set_couple1,
      r.second_set_couple2,
      r.third_set_couple1,
      r.third_set_couple2,
      r.winner_couple,
      r.wo,
    CONCAT_WS(" - ",
      IFNULL(CONCAT(u1.name, " ", u1.last_name), 'SIN PAREJA'),
      IFNULL(CONCAT(u2.name, " ", u2.last_name), 'SIN PAREJA')
    ) AS pareja1,
    CONCAT_WS(" - ",
      IFNULL(CONCAT(u3.name, " ", u3.last_name), 'SIN PAREJA'),
      IFNULL(CONCAT(u4.name, " ", u4.last_name), 'SIN PAREJA')
    ) AS pareja2, c.name as categoria from matches m 
     left join result_match r on m.id = r.id_match

      LEFT JOIN couples c1 ON m.id_couple1 = c1.id
      LEFT JOIN players p1 ON c1.id_player1 = p1.id
      LEFT JOIN players p2 ON c1.id_player2 = p2.id
      LEFT JOIN users u1 ON p1.id_user = u1.id
      LEFT JOIN users u2 ON p2.id_user = u2.id

      LEFT JOIN couples c2 ON m.id_couple2 = c2.id
      LEFT JOIN players p3 ON c2.id_player1 = p3.id
      LEFT JOIN players p4 ON c2.id_player2 = p4.id
      LEFT JOIN users u3 ON p3.id_user = u3.id
      LEFT JOIN users u4 ON p4.id_user = u4.id
      LEFT JOIN categories c ON m.id_category = c.id
      where m.id_tournament = ? and m.is_drop = 0` :

      `select m.*,
      r.first_set_couple1,
      r.first_set_couple2,
      r.second_set_couple1,
      r.second_set_couple2,
      r.third_set_couple1,
      r.third_set_couple2,
      r.winner_couple,
      r.wo,
    CONCAT_WS(" - ",
      IFNULL(CONCAT(u1.name, " ", u1.last_name), 'SIN PAREJA'),
      IFNULL(CONCAT(u2.name, " ", u2.last_name), 'SIN PAREJA')
    ) AS pareja1,
    CONCAT_WS(" - ",
      IFNULL(CONCAT(u3.name, " ", u3.last_name), 'SIN PAREJA'),
      IFNULL(CONCAT(u4.name, " ", u4.last_name), 'SIN PAREJA')
    ) AS pareja2, c.name as categoria from users u  
      inner join user_club uc on u.id = uc.id_user
      inner join matches m on uc.id_club = m.id_club
      left join result_match r on m.id = r.id_match


      LEFT JOIN couples c1 ON m.id_couple1 = c1.id
      LEFT JOIN players p1 ON c1.id_player1 = p1.id
      LEFT JOIN players p2 ON c1.id_player2 = p2.id
      LEFT JOIN users u1 ON p1.id_user = u1.id
      LEFT JOIN users u2 ON p2.id_user = u2.id

      LEFT JOIN couples c2 ON m.id_couple2 = c2.id
      LEFT JOIN players p3 ON c2.id_player1 = p3.id
      LEFT JOIN players p4 ON c2.id_player2 = p4.id
      LEFT JOIN users u3 ON p3.id_user = u3.id
      LEFT JOIN users u4 ON p4.id_user = u4.id
      LEFT JOIN categories c ON m.id_category = c.id
      where m.id_tournament = ? and u.id = ? and m.is_drop = 0;
    `

    const results = await executeQuery(query,
      [id_tournament, id_user]
    )

    return results
  }
}

export default ResultMatchRepositoryMysql

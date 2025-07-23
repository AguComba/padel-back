import {executeQuery} from "../../../utils/executeQuery.js"
import ResultMatchRepository from "../Domain/ResultMatchRepository.js"

class ResultMatchRepositoryMysql extends ResultMatchRepository {
  async save(resultMatch) {
    const query = `
      INSERT INTO result_match (
        first_set_couple1, first_set_couple2,
        second_set_couple1, second_set_couple2,
        third_set_couple1, third_set_couple2,
        winner_couple, result_string, wo, id_match,
        match_type,
        created_at, updated_at, user_created, user_updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      resultMatch.wo,
      resultMatch.id_match,
      resultMatch.match_type,
      resultMatch.created_at,
      resultMatch.updated_at,
      resultMatch.user_created,
      resultMatch.user_updated,
    ]

    return await executeQuery(query, values)
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
      `select r.* from zones_matches z
        inner join result_match r on z.id = r.id_match
        where r.match_type = 'zona' and z.zone = ? and z.id_category = ? and z.id_tournament = ?;`,
      [zone, category, id_tournament]
    )
    return results
  }

  async findMatchsByUserLargador({id_user, id_tournament, is_creator_or_admin}) {

    const query = is_creator_or_admin ? `select z.*,
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
    ) AS pareja2 from zones_matches z 
     left join result_match r on z.id = r.id_match

      LEFT JOIN couples c1 ON z.id_couple1 = c1.id
      LEFT JOIN players p1 ON c1.id_player1 = p1.id
      LEFT JOIN players p2 ON c1.id_player2 = p2.id
      LEFT JOIN users u1 ON p1.id_user = u1.id
      LEFT JOIN users u2 ON p2.id_user = u2.id

      LEFT JOIN couples c2 ON z.id_couple2 = c2.id
      LEFT JOIN players p3 ON c2.id_player1 = p3.id
      LEFT JOIN players p4 ON c2.id_player2 = p4.id
      LEFT JOIN users u3 ON p3.id_user = u3.id
      LEFT JOIN users u4 ON p4.id_user = u4.id
      where z.id_tournament = ?` :

      `select z.*,
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
    ) AS pareja2 from users u  
      inner join user_club uc on u.id = uc.id_user
      inner join zones_matches z on uc.id_club = z.id_club
      left join result_match r on z.id = r.id_match


      LEFT JOIN couples c1 ON z.id_couple1 = c1.id
      LEFT JOIN players p1 ON c1.id_player1 = p1.id
      LEFT JOIN players p2 ON c1.id_player2 = p2.id
      LEFT JOIN users u1 ON p1.id_user = u1.id
      LEFT JOIN users u2 ON p2.id_user = u2.id

      LEFT JOIN couples c2 ON z.id_couple2 = c2.id
      LEFT JOIN players p3 ON c2.id_player1 = p3.id
      LEFT JOIN players p4 ON c2.id_player2 = p4.id
      LEFT JOIN users u3 ON p3.id_user = u3.id
      LEFT JOIN users u4 ON p4.id_user = u4.id
      where z.id_tournament = ? and u.id = ?;
    `

    const results = await executeQuery(query,
      [id_tournament, id_user]
    )

    return results
  }
}

export default ResultMatchRepositoryMysql

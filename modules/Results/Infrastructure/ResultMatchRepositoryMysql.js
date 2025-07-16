import { executeQuery } from '../../../utils/executeQuery.js' 
import ResultMatchRepository from '../Domain/ResultMatchRepository.js' 

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
    const results = await executeQuery('SELECT * FROM result_match WHERE id = ?', [id])
    return results[0]
  }

  async findByMatchId(id_match) {
    const results = await executeQuery('SELECT * FROM result_match WHERE id_match = ?', [id_match])
    return results[0]
  }

  async findByZone(zone, category, id_tournament){
    const results = await executeQuery('SELECT * FROM result_match WHERE zone = ? AND category = ? AND id_tournament = ?', [zone, category, id_tournament])
    return results
  }
}

export default ResultMatchRepositoryMysql

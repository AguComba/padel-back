import { executeQuery } from "../../utils/executeQuery.js"

export class ZonesModel {
  static async getZones(id_tournament, id_category) {
    const query = `SELECT zm.*, 
        IFNULL(CONCAT(u1.name, " ", u1.last_name, " - ", u2.name, " ", u2.last_name), 'SIN PAREJA') AS pareja1, 
        IFNULL(CONCAT(u3.name, " ", u3.last_name, " - ", u4.name, " ", u4.last_name), 'SIN PAREJA') AS pareja2,
        cl.name AS club_name, rm.first_set_couple1, rm.first_set_couple2, rm.second_set_couple1, rm.second_set_couple2,
        rm.third_set_couple1, rm.third_set_couple2, rm.winner_couple, rm.wo
        FROM zones_matches zm
        LEFT JOIN result_match rm ON rm.id_match = zm.id
        LEFT JOIN clubs cl ON zm.id_club = cl.id

        LEFT JOIN couples c1 ON zm.id_couple1 = c1.id
        LEFT JOIN players p1 ON c1.id_player1 = p1.id
        LEFT JOIN players p2 ON c1.id_player2 = p2.id
        LEFT JOIN users u1 ON p1.id_user = u1.id
        LEFT JOIN users u2 ON p2.id_user = u2.id 
        
        LEFT JOIN couples c2 ON zm.id_couple2 = c2.id
        LEFT JOIN players p3 ON c2.id_player1 = p3.id
        LEFT JOIN players p4 ON c2.id_player2 = p4.id
        LEFT JOIN users u3 ON p3.id_user = u3.id
        LEFT JOIN users u4 ON p4.id_user = u4.id 
        
        WHERE zm.id_tournament = ?
        AND zm.id_category = ?
        ORDER BY zm.zone, \`match\``
    const zones = await executeQuery(query, [id_tournament, id_category])
    return zones
  }
  static async saveZones(zones) {
    await this.deleteZones(zones[0].id_tournament, zones[0].id_category)
    const query = `INSERT INTO zones_matches (id_tournament, id_category, id_couple1, points_couple1, id_couple2, points_couple2, \`match\`, rival1, rival2, zone, day, id_club, hour) VALUES ?`
    const values = zones.map((zone) => [
      zone.id_tournament,
      zone.id_category,
      zone.id_couple1,
      zone.points_couple1,
      zone.id_couple2,
      zone.points_couple2,
      zone.match,
      zone.rival1 || null,
      zone.rival2 || null,
      zone.zone,
      zone.day,
      zone.id_club,
      `${zone.hour}:00`,
    ])
    await executeQuery(query, [values])
    return true
  }
  static async deleteZones(id_tournament, id_category) {
    const query = `DELETE FROM zones_matches WHERE id_tournament = ? AND id_category = ?`
    await executeQuery(query, [id_tournament, id_category])
    return true
  }
  static async searchGeneratedZones(id_tournament, id_category) {
    const query = `SELECT * FROM zones_matches WHERE id_tournament = ? AND id_category = ?`
    const zones = await executeQuery(query, [id_tournament, id_category])
    return zones
  }

  static async getMatchsByZone(id){
    const query = `  SELECT 
    z.id_couple1,
    z.id_couple2,
    r.first_set_couple1,
    r.first_set_couple2,
    r.second_set_couple1,
    r.second_set_couple2,
    r.third_set_couple1,
    r.third_set_couple2,
    r.winner_couple,
    r.wo,

    IFNULL(CONCAT(u1.name, ' ', u1.last_name, ' - ', u2.name, ' ', u2.last_name), 'SIN PAREJA') AS pareja1,
    IFNULL(CONCAT(u3.name, ' ', u3.last_name, ' - ', u4.name, ' ', u4.last_name), 'SIN PAREJA') AS pareja2

  FROM zones_matches z
  INNER JOIN result_match r ON z.id = r.id_match

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

  WHERE z.id IN (?)
  AND r.match_type = 'zona'`
    const matchs = await executeQuery(query, [id])
    return matchs
  }
}

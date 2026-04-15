import { executeQuery } from "../../utils/executeQuery.js"

export class ZonesModel {
  static async getZones(id_tournament, id_category, isDrop = false) {
    const query = `SELECT m.*, 
        IFNULL(CONCAT(u1.name, " ", u1.last_name, " - ", u2.name, " ", u2.last_name), 'SIN PAREJA') AS pareja1, 
        IFNULL(CONCAT(u1.last_name, " - ", u2.last_name), 'SIN PAREJA') AS pareja1_last_name, 
        IFNULL(CONCAT(u3.name, " ", u3.last_name, " - ", u4.name, " ", u4.last_name), 'SIN PAREJA') AS pareja2,
        IFNULL(CONCAT(u3.last_name, " - ", u4.last_name), 'SIN PAREJA') AS pareja2_last_name,
        cl.name AS club_name, rm.first_set_couple1, rm.first_set_couple2, rm.second_set_couple1, rm.second_set_couple2,
        rm.third_set_couple1, rm.third_set_couple2, rm.winner_couple, rm.wo
        FROM matches m
        LEFT JOIN result_match rm ON rm.id_match = m.id
        LEFT JOIN clubs cl ON m.id_club = cl.id

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
        LEFT JOIN tournaments t ON m.id_tournament = t.id
        
        WHERE m.id_tournament = ?
        AND m.id_category = ?
        AND t.public IN (1,2)
        AND m.is_drop = ?
        ORDER BY m.zone, \`match\``
    const zones = await executeQuery(query, [id_tournament, id_category, isDrop])
    return zones
  }
  
    static async saveZones(zones) {
      // Función para formatear los valores y evitar undefined
      const formatZone = (zone) => [
        zone.id_tournament ?? null,
        zone.id_category ?? null,
        zone.id_couple1 ?? null,
        zone.points_couple1 ?? null,
        zone.id_couple2 ?? null,
        zone.points_couple2 ?? null,
        zone.match ?? null,
        zone.rival1 || null,
        zone.rival2 || null,
        zone.zone ?? null,
        zone.day ?? null,
        zone.id_club ?? null,
        zone.hour ? zone.hour.length === 8 ? zone.hour : `${zone.hour}:00` : null
      ];
    
      const inserts = [];
      const updatePromises = [];
    
      for (const zone of zones) {
        if (zone.id && Number.isInteger(zone.id)) {
          // UPDATE en paralelo
          updatePromises.push(
            executeQuery(
              `
              UPDATE matches
              SET 
                id_tournament = ?, 
                id_category = ?, 
                id_couple1 = ?, 
                points_couple1 = ?, 
                id_couple2 = ?, 
                points_couple2 = ?, 
                \`match\` = ?, 
                rival1 = ?, 
                rival2 = ?, 
                zone = ?, 
                day = ?, 
                id_club = ?, 
                hour = ?
              WHERE id = ?
            `,
              [...formatZone(zone), zone.id]
            )
          );
        } else {
          inserts.push(formatZone(zone));
        }
      }
    
      // Ejecutar todos los updates en paralelo
      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
      }
    
      // INSERT masivo para nuevos registros
      if (inserts.length > 0) {
        await executeQuery(
          `
          INSERT INTO matches 
          (id_tournament, id_category, id_couple1, points_couple1, id_couple2, points_couple2, \`match\`, rival1, rival2, zone, day, id_club, hour)
          VALUES ?
        `,
          [inserts]
        );
      }
    
      return true;
    }
  
  static async deleteZones(id_tournament, id_category) {
    const query = `DELETE FROM matches WHERE id_tournament = ? AND id_category = ?`
    await executeQuery(query, [id_tournament, id_category])
    return true
  }
  static async searchGeneratedZones(id_tournament, id_category) {
    const query = `SELECT m.*, rm.id as idMatch FROM matches m LEFT JOIN result_match rm ON m.id = rm.id_match WHERE m.id_tournament = ? AND m.id_category = ? AND m.is_drop = 0`
    const zones = await executeQuery(query, [id_tournament, id_category])
    return zones
  }

  static async getMatchsByZone(id){
    const query = `  SELECT 
    m.id_couple1,
    m.id_couple2,
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

  FROM matches m
  INNER JOIN result_match r ON m.id = r.id_match

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

  WHERE m.id IN (?)
  AND r.match_type = 'zona'`
    const matchs = await executeQuery(query, [id])
    return matchs
  }
}

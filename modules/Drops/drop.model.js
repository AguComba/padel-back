import {executeQuery} from "../../utils/executeQuery.js";

export class DropModel {
    static async createDrops(tournament, category, matches) {
        const rows = matches.map((match) => {
            const [zone, matchNumber] = match.id.split('-')
            const number = zone === 'final' ? 1 : Number(matchNumber)
            const hora = match.hour ? `${match.hour}:00` : null

            return [
                tournament,
                category,
                match.rival1,         // solo se usa al INSERT
                match.rival2,         // solo se usa al INSERT
                number,               // `match`
                zone,                 // zone
                match.day,
                match.id_club,
                hora,
                true                  // is_drop
            ]
        })

        if (rows.length === 0) return true

        await executeQuery(
            `
        INSERT INTO matches
            (id_tournament, id_category, rival1, rival2, \`match\`, zone, day, id_club, hour, is_drop)
        VALUES ?
        ON DUPLICATE KEY UPDATE
            day = VALUES(day),
            id_club = VALUES(id_club),
            hour = VALUES(hour),
            updated_at = CURRENT_TIMESTAMP
        `,
            [rows]
        )

        return true
    }

    static async findUpdateDrops(id_matchs) {
        const [matchs] = await executeQuery(
            `
                SELECT id, id_tournament, id_category, zone 
                FROM matches
                WHERE id IN (?)
                LIMIT 1
            `,
            [id_matchs]
        )

        const dropsToUpdate = await executeQuery(
            `SELECT * FROM matches where id_tournament = ? and id_category = ? and is_drop = 1`,
            [matchs.id_tournament, matchs.id_category]
        )

        // Filtro los drops en donde rival1 o rival2 coincidan con la zona
        const dropsToUpdateFiltered = dropsToUpdate.filter((drop) => drop?.rival1?.includes(matchs.zone) || drop?.rival2?.includes(matchs.zone))
        return {drops: dropsToUpdateFiltered, zone: matchs.zone, allDrops: dropsToUpdate}
    }


    static async updateDrops(drops) {
        const updatePromises = drops.map((drop) => {
            return executeQuery(
                `
                    UPDATE matches
                    SET id_couple1 = ?, id_couple2 = ?
                    WHERE id = ?
                `,
                [drop.id_couple1, drop.id_couple2, drop.id]
            )
        })

        const results = await Promise.all(updatePromises)
        return results.every((result) => result.affectedRows > 0)
    }

    static async findDropByIdMatch(id_match) {
        const [currentMatch] = await executeQuery(
            `SELECT * FROM matches where id = ? and is_drop = 1`,
            [id_match]
        )

        if(currentMatch.zone === 'final'){
            return {drop: null, currentMatch}
        }
        const rival = currentMatch ? `${currentMatch.zone}-${currentMatch.match}` : ""

        const [drop] = await executeQuery(
            `SELECT * FROM matches where id_tournament = ? and id_category = ? and (rival1 = ? or rival2 = ?) and is_drop = 1`,
            [currentMatch.id_tournament, currentMatch.id_category, rival, rival]
        )

        return {drop, currentMatch}
    }
}
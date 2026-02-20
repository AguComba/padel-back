import {executeQuery} from "../../utils/executeQuery.js";

export class DropModel {
    static async createDrops(tournament, category, matches) {
        const parsedMatches = matches.map((match) => {
            const [instance, matchNumber] = match.id.split('-')
            return {
                instance,
                matchNumber,
                values: [tournament, category, match.rival1, match.rival2, matchNumber, instance, match.day, match.id_club, `${match.hour}:00`, true]
            }
        })

        if (parsedMatches.length === 0) return true

        const existingDropFilters = parsedMatches
            .map(() => '(\`match\` = ? AND zone = ?)')
            .join(' OR ')
        const existingDropParams = parsedMatches.flatMap(({ matchNumber, instance }) => [matchNumber, instance])

        const existingDrops = await executeQuery(
            `
                SELECT \`match\`, zone
                FROM matches
                WHERE id_tournament = ?
                    AND id_category = ?
                    AND (${existingDropFilters})
            `,
            [tournament, category, ...existingDropParams]
        )

        const existingDropsSet = new Set(
            existingDrops.map((drop) => `${drop.zone}-${drop.match}`)
        )

        const formattedMatches = parsedMatches
            .filter(({ instance, matchNumber }) => !existingDropsSet.has(`${instance}-${matchNumber}`))
            .map(({ values }) => values)

        if (formattedMatches.length > 0) {
            await executeQuery(
                `
          INSERT INTO matches 
          (id_tournament, id_category, rival1, rival2, \`match\`, zone, day, id_club, hour, is_drop)
          VALUES ?
            `,
                [formattedMatches]
            );
        }

        return true;
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
        return {drops: dropsToUpdateFiltered, zone: matchs.zone}
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
}
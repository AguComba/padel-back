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
}



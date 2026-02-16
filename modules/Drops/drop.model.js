import {executeQuery} from "../../utils/executeQuery.js";

export class DropModel {
    static async createDrops(tournament, category, matches) {
        const formattedMatches = matches.map((match) => {
            const [instance, matchNumber] = match.id.split('-')
            return [tournament, category, match.rival1, match.rival2, matchNumber, instance, match.day, match.id_club, `${match.hour}:00`, true]
        })

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
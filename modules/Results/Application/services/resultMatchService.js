import GetMatchsByUserLargador from "../use-cases/GetMatchsByUserLargador.js";
import GetResultsMatchsByZone from "../use-cases/GetResultsMatchsByZone.js";
import RegisterResultMatch from "../use-cases/RegisterResultMatch.js";

export function createResultMatchService(repository) {
    return {
        register: new RegisterResultMatch(repository),
        getResultsByZone: new GetResultsMatchsByZone(repository),
        getMatchsByUserLargador: new GetMatchsByUserLargador(repository)
    }
}
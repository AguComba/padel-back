export default class GetResultsMatchsByZone{
    constructor(resultMatchRepository){
        this.resultMatchRepository = resultMatchRepository
    }

    async execute({zone, category, id_tournament}){
        if(!zone || !category || !id_tournament){
            throw new Error('Faltan parámetros obligatorios')
        }
        
        return await this.resultMatchRepository.findAllMatchsByZone({zone, category, id_tournament})
    }
}
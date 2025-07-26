export default class GetMatchsByUserLargador{
    constructor(resultMatchRepository){
        this.resultMatchRepository = resultMatchRepository
    }

    async execute({id_user, id_tournament, is_creator_or_admin}){
        if(!id_user || !id_tournament){
            throw new Error('Faltan parámetros obligatorios')
        }
        
        return await this.resultMatchRepository.findMatchsByUserLargador({id_user, id_tournament, is_creator_or_admin})
    }
}
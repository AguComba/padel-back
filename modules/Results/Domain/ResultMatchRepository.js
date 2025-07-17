export default class ResultMatchRepository {
    async save(resultMatch){
        throw new Error('Metodo no implementado')
    }
    async findById(id){
        throw new Error('Metodo no implementado')
    }
    async findByMatchId(id_match){
        throw new Error('Metodo no implementado')
    }
    async findAllMatchsByZone({zone, category, id_tournament}){
        throw new Error('Metodo no implementado')
    }
    async findMatchsByUserLargador({id_user, id_tournament}){
        throw new Error('Metodo no implementado')
    }
}
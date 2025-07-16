import ResultMatch from "../Domain/ResultMatch.js" 

export default class RegisterResultMatch {
    constructor(resultMatchRepository){
        this.resultMatchRepository = resultMatchRepository
    }
    async execute(data){
        const resultMatch = new ResultMatch(data)

        await this.resultMatchRepository.save(resultMatch)
        
        return resultMatch
    }
}

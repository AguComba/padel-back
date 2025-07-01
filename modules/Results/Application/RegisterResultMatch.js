import ResultMatch from "../Domain/ResultMatch"

class RegisterResultMatch {
    constructor(resultMatchRepository){
        this.resultMatchRepository = resultMatchRepository
    }
    async execute(data){
        const ResultMatch = new ResultMatch(data)

        await this.resultMatchRepository.save(ResultMatch)
        
        return ResultMatch
    }
}
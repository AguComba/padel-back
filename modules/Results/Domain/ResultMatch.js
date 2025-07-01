class ResultMatch {
  constructor({
    id,
    firstSetCouple1,
    firstSetCouple2,
    secondSetCouple1,
    secondSetCouple2,
    thirdSetCouple1,
    thirdSetCouple2,
    winnerCouple,
    resultString,
    wo,
    idMatch,
    matchType, // zona/cuadro
    createdAt,
    updatedAt,
    userCreated,
    userUpdated
  }) {
    this.id = id;
    this.firstSetCouple1 = firstSetCouple1;
    this.firstSetCouple2 = firstSetCouple2;
    this.secondSetCouple1 = secondSetCouple1;
    this.secondSetCouple2 = secondSetCouple2;
    this.thirdSetCouple1 = thirdSetCouple1;
    this.thirdSetCouple2 = thirdSetCouple2;
    this.winnerCouple = winnerCouple;
    this.resultString = resultString;
    this.wo = wo;
    this.idMatch = idMatch;
    this.matchType = matchType; // zona/cuadro
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.userCreated = userCreated;
    this.userUpdated = userUpdated;
  }
}

module.exports = ResultMatch;

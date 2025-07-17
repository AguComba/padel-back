export default class ResultMatch {
  constructor({
    id,
    first_set_couple1,
    first_set_couple2,
    second_set_couple1,
    second_set_couple2,
    third_set_couple1,
    third_set_couple2,
    winner_couple,
    result_string,
    wo,
    id_match,
    match_type, // zona/cuadro
    created_at,
    updated_at,
    user_created,
    user_updated
  }) {
    this.id = id;
    this.first_set_couple1 = first_set_couple1;
    this.first_set_couple2 = first_set_couple2;
    this.second_set_couple1 = second_set_couple1;
    this.second_set_couple2 = second_set_couple2;
    this.third_set_couple1 = third_set_couple1;
    this.third_set_couple2 = third_set_couple2;
    this.winner_couple = winner_couple;
    this.result_string = result_string;
    this.wo = wo;
    this.id_match = id_match;
    this.match_type = match_type; // zona/cuadro
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.user_created = user_created;
    this.user_updated = user_updated;
  }
}


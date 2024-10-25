CREATE TABLE result_match(
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_set_couple1 INT NOT NULL,
    first_set_couple2 INT NOT NULL,
    second_set_couple1 INT NOT NULL,
    second_set_couple2 INT NOT NULL,
    third_set_couple1 INT NOT NULL,
    third_set_couple2 INT NOT NULL,
    winner_couple INT NOT NULL,
    result_string VARCHAR(50) NOT NULL,
    id_match BIGINT NOT NULL,INT 
    FOREIGN KEY (id_match) REFERENCES matches(id)
    FOREIGN KEY (winner_couple) REFERENCES couples_zone(id)
);
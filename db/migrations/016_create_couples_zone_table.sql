CREATE TABLE couples_zone(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    id_couple INT NOT NULL,
    number_couple INT NOT NULL,
    position INT NOT NULL,
    games INT,
    sets INT,
    id_zone INT NOT NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    tournament_result INT,
    created_at TIMESTAMP NOT NULL DEFAULT (NOW()),
    FOREIGN KEY (id_couple) REFERENCES couples(id),
    FOREIGN KEY (id_zone) REFERENCES zones(id)
)
CREATE TABLE matches(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    date_match DATETIME NOT NULL,
    id_club INT NOT NULL,
    id_couple_zone1 INT NOT NULL,
    id_couple_zone2 INT NOT NULL,    
    round INT NOT NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT (NOW()),
    user_update INT NOT NULL,
    FOREIGN KEY (id_club) REFERENCES clubs(id),
    FOREIGN KEY (id_couple_zone1) REFERENCES couples_zone(id),
    FOREIGN KEY (id_couple_zone2) REFERENCES couples_zone(id)
    FOREIGN KEY (user_update) REFERENCES users(id)
)
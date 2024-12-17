CREATE TABLE drops(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    position1 INT NOT NULL,
    zone1 INT,
    position2 INT,
    zone2 INT,
    position_earned INT NOT NULL,
    round INT NOT NULL,
    id_match BIGINT,
    user_created INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_updated INT NOT NULL,
    FOREIGN KEY (id_match) REFERENCES matches(id),
    FOREIGN KEY (zone1) REFERENCES zones(id),
    FOREIGN KEY (zone2) REFERENCES zones(id),
    FOREIGN KEY (user_created) REFERENCES users(id),
    FOREIGN KEY (user_updated) REFERENCES users(id)
)
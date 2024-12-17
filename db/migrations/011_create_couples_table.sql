CREATE TABLE couples(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_player1 INT NOT NULL,
    id_player2 INT NOT NULL,
    id_club INT NOT NULL,
    points INT NOT NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_player1) REFERENCES players(id),
    FOREIGN KEY (id_player2) REFERENCES players(id),
    FOREIGN KEY (id_club) REFERENCES clubs(id)
)
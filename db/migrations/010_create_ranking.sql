CREATE TABLE ranking(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_player INT NOT NULL,
    points INT NOT NULL,
    id_federation INT NOT NULL,
    id_category INT NOT NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    year INT NOT NULL,
    gender ENUM('F', 'X'),
    user_updated INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_updated) REFERENCES users(id),
    FOREIGN KEY (id_player) REFERENCES players(id),
    FOREIGN KEY (id_federation) REFERENCES federations(id),
    FOREIGN KEY (id_category) REFERENCES categories(id)
);
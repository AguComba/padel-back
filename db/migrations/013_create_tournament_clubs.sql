CREATE TABLE tournament_clubs(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_tournament INT NOT NULL,
    id_club INT NOT NULL,
    main_club TINYINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_created INT NOT NULL,
    updated_at TIMESTAMP,
    user_updated INT,
    status TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (id_tournament) REFERENCES tournaments(id),
    FOREIGN KEY (id_club) REFERENCES clubs(id),
    FOREIGN KEY (user_created) REFERENCES users(id),
    FOREIGN KEY (user_updated) REFERENCES users(id)
)
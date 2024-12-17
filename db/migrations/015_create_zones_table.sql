CREATE TABLE zones(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    id_tournament_categories INT NOT NULL,
    user_created INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_updated INT,
    updated_at TIMESTAMP,
    FOREIGN KEY (id_tournament_categories) REFERENCES tournament_categories(id),
    FOREIGN KEY (user_created) REFERENCES users(id),
    FOREIGN KEY (user_updated) REFERENCES users(id)
)
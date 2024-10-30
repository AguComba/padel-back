CREATE TABLE zones(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    id_tournament_categories INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT (NOW()),
    FOREIGN KEY (id_tournament_categories) REFERENCES tournament_categories(id)
)
CREATE TABLE tournament_categories(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_tournament INT NOT NULL,
    id_category INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT (NOW()),
    status TINYINT(1) NOT NULL DEFAULT 1,
    gender ENUM('M', 'F', 'O') NOT NULL,
    FOREIGN KEY (id_tournament) REFERENCES tournaments(id),
    FOREIGN KEY (id_category) REFERENCES categories(id)
)
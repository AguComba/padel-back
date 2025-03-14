CREATE TABLE ranking_history(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_ranking INT NOT NULL,
    id_tournament_category INT NOT NULL,
    points INT NOT NULL,
    user_updated INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
)
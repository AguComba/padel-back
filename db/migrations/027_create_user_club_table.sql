CREATE TABLE user_club(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_club INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_club) REFERENCES clubs(id)
)
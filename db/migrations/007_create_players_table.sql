CREATE TABLE players(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_category INT NOT NULL,
    possition ENUM('DRIVE', 'REVES'),
    hand ENUM('DERECHA', 'IZQUIERDA'),
    status TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    afiliation BOOLEAN NOT NULL,
    updated_at TIMESTAMP,
    user_updated INT,
    id_club INT NOT NULL,
    FOREIGN KEY (id_club) REFERENCES clubs(id),
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_category) REFERENCES categories(id),
    FOREIGN KEY (user_updated) REFERENCES users(id)
)

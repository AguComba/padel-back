CREATE TABLE clubs(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    id_city INT NOT NULL,
    id_federation INT NOT NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT (NOW()),
    user_created INT NOT NULL,
    courts INT NOT NULL,
    id_administrator INT NOT NULL,
    FOREIGN KEY (id_federation) REFERENCES federations(id),
    FOREIGN KEY (id_city) REFERENCES cities(id)
    FOREIGN KEY (user_created) REFERENCES users(id)
    FOREIGN KEY (id_administrator) REFERENCES users(id)
)


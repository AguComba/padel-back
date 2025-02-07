CREATE TABLE inscriptions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    id_tournament INT NOT NULL,
    id_couple INT NOT NULL,
    id_category INT NOT NULL, 
    status TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_created INT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_updated INT NOT NULL,
    status_payment ENUM('PENDING', 'PAID') NOT NULL DEFAULT 'PENDING',
    FOREIGN KEY (id_tournament) REFERENCES tournaments(id),
    FOREIGN KEY (id_couple) REFERENCES couples(id),
    FOREIGN KEY (id_category) REFERENCES categories(id),
    FOREIGN KEY (user_created) REFERENCES users(id),
    FOREIGN KEY (user_updated) REFERENCES users(id)
);
CREATE TABLE inscriptions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    id_tournament INT NOT NULL,
    id_couple INT NOT NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT (NOW()),
    status_payment ENUM('PENDING', 'PAID') NOT NULL DEFAULT 'PENDING',
    FOREIGN KEY (id_tournament) REFERENCES tournaments(id),
    FOREIGN KEY (id_couple) REFERENCES couples(id)
);
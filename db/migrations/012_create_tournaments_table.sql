CREATE TABLE tournaments(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    id_federation INT NOT NULL,
    date_start DATE NOT NULL,
    date_inscription_start DATETIME NOT NULL,
    date_inscription_end DATETIME NOT NULL,
    max_couples INT NOT NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    afiliation_required BOOLEAN NOT NULL DEFAULT TRUE,
    type_tournament ENUM('PARTICULAR', 'FEDERADO', 'MASTER'),
    created_at TIMESTAMP NOT NULL DEFAULT (NOW())
    FOREIGN KEY (id_federation) REFERENCES federations(id)
)
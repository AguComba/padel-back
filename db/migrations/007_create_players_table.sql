CREATE TABLE players(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_category INT NOT NULL,
    possition ENUM('DRIVE', 'REVES'),
    status TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT (NOW()),
    afiliation BOOLEAN NOT NULL 
)

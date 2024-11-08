CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    cell_phone CHAR(11) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    type_document ENUM('LE', 'DNI', 'CI') NOT NULL,
    number_document CHAR(9) NOT NULL,
    gender ENUM('M', 'F', 'O') NOT NULL,
    id_city INT NOT NULL,
    password VARCHAR(255) NOT NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT (NOW()),
    FOREIGN KEY (id_city) REFERENCES cities(id)
)
CREATE TABLE payments(
    id INT PRIMARY KEY AUTO_INCREMENT,
    entity ENUM('MP', 'MACRO') NOT NULL,
    transaction_id VARCHAR(255),
    external_id VARCHAR(255),
    type ENUM('AFILIACION', 'INSCRIPCION') NOT NULL,
    amount FLOAT(11,2) NOT NULL,
    id_user INT NOT NULL,
    status TINYINT,
    message VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id)
)
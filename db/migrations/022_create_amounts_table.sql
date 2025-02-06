CREATE TABLE amounts( 
    id INT PRIMARY KEY AUTO_INCREMENT, 
    type_amount ENUM('AFILIACION', 'INSCRIPCION') NOT NULl,
    amount DECIMAL(12, 2) NOT NULL,
    id_tournament INT,
    FOREIGN KEY (id_tournament) REFERENCES tournaments(id)
)
CREATE TABLE federations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    id_province INT NOT NULL,
    FOREIGN KEY (id_province) REFERENCES provinces(id)
);
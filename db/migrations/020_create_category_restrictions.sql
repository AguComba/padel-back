CREATE TABLE category_restrictions(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_category INT NOT NULL,
    category_gender ENUM('M', 'F', 'O') NOT NULL,
    id_authorized_category INT NOT NULL,
    authorized_category_gender ENUM('M', 'F', 'O') NOT NULL,
    FOREIGN KEY (id_category) REFERENCES categories(id),
    FOREIGN KEY (id_authorized_category) REFERENCES categories(id)
)
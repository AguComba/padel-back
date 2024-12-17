CREATE TABLE type_sanctions(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    user_created INT NOT NULL,
    user_updated INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_created) REFERENCES users(id),
    FOREIGN KEY (user_updated) REFERENCES users(id)
);
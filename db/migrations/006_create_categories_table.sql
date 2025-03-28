CREATE TABLE categories(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    show_player TINYINT NOT NULL DEFAULT 1,
    status TINYINT(1) NOT NULL DEFAULT 1,
    level INT NOT NULL,
    user_updated INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_updated) REFERENCES users(id)
)
CREATE TABLE couple_game_days(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_inscription BIGINT NOT NULL,
    availablity_days ENUM('L', 'M', 'X', 'J', 'V', 'S', 'D'),
    FOREIGN KEY (id_inscription) REFERENCES inscriptions(id)
)
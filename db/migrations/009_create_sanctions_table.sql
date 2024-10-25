CREATE TABLE sanctions(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_player INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT (NOW()),
    date_start DATE NOT NULL,
    date_end DATE NOT NULL,
    id_federation INT NOT NULL,
    type_sanction INT NOT NULL,
    created_user INT NOT NULL,
    FOREIGN KEY (id_player) REFERENCES players(id),
    FOREIGN KEY (id_federation) REFERENCES federations(id),
    FOREIGN KEY (type_sanction) REFERENCES type_sanctions(id),
    FOREIGN KEY (created_user) REFERENCES users(id) -- hace referencia a el usuario que creo la sancion
)
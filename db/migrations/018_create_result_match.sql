-- railway.result_match definition

CREATE TABLE `result_match` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_set_couple1` int DEFAULT NULL,
  `first_set_couple2` int DEFAULT NULL,
  `second_set_couple1` int DEFAULT NULL,
  `second_set_couple2` int DEFAULT NULL,
  `third_set_couple1` int DEFAULT NULL,
  `third_set_couple2` int DEFAULT NULL,
  `winner_couple` bigint NOT NULL,
  `result_string` varchar(50) NOT NULL,
  `wo` tinyint(1) DEFAULT '0',
  `id_match` bigint NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_created` int NOT NULL,
  `user_updated` int NOT NULL,
  `match_type` enum('zona','cuadro') NOT NULL DEFAULT 'zona',
  PRIMARY KEY (`id`),
  KEY `user_created` (`user_created`),
  KEY `user_updated` (`user_updated`),
  CONSTRAINT `result_match_ibfk_3` FOREIGN KEY (`user_created`) REFERENCES `users` (`id`),
  CONSTRAINT `result_match_ibfk_4` FOREIGN KEY (`user_updated`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
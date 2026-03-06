SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `amounts`;
CREATE TABLE `amounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type_amount` enum('AFILIACION','INSCRIPCION') NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `id_tournament` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_tournament` (`id_tournament`),
  CONSTRAINT `amounts_ibfk_1` FOREIGN KEY (`id_tournament`) REFERENCES `tournaments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `show_player` tinyint NOT NULL DEFAULT '1',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `level` int NOT NULL,
  `user_updated` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_updated` (`user_updated`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`user_updated`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `category_restrictions`
--

DROP TABLE IF EXISTS `category_restrictions`;
CREATE TABLE `category_restrictions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_category` int NOT NULL,
  `id_authorized_category` int NOT NULL,
  `authorized_category_gender` enum('M','F','O') NOT NULL,
  `category_gender` enum('M','F','O') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_category` (`id_category`),
  KEY `id_authorized_category` (`id_authorized_category`),
  CONSTRAINT `category_restrictions_ibfk_1` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id`),
  CONSTRAINT `category_restrictions_ibfk_2` FOREIGN KEY (`id_authorized_category`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
CREATE TABLE `cities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `zip_code` char(5) NOT NULL,
  `id_province` int NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `zip_code` (`zip_code`),
  KEY `id_province` (`id_province`),
  CONSTRAINT `cities_ibfk_1` FOREIGN KEY (`id_province`) REFERENCES `provinces` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `clubs`
--

DROP TABLE IF EXISTS `clubs`;
CREATE TABLE `clubs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  `id_city` int NOT NULL,
  `id_federation` int NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_created` int NOT NULL,
  `courts` int NOT NULL,
  `id_administrator` int NOT NULL,
  `afiliation` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `id_federation` (`id_federation`),
  KEY `id_city` (`id_city`),
  KEY `user_created` (`user_created`),
  KEY `id_administrator` (`id_administrator`),
  CONSTRAINT `clubs_ibfk_1` FOREIGN KEY (`id_federation`) REFERENCES `federations` (`id`),
  CONSTRAINT `clubs_ibfk_2` FOREIGN KEY (`id_city`) REFERENCES `cities` (`id`),
  CONSTRAINT `clubs_ibfk_3` FOREIGN KEY (`user_created`) REFERENCES `users` (`id`),
  CONSTRAINT `clubs_ibfk_4` FOREIGN KEY (`id_administrator`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `couple_game_days`
--

DROP TABLE IF EXISTS `couple_game_days`;
CREATE TABLE `couple_game_days` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_inscription` bigint NOT NULL,
  `availablity_days` enum('L','M','X','J','V','S','D') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_inscription` (`id_inscription`),
  CONSTRAINT `couple_game_days_ibfk_1` FOREIGN KEY (`id_inscription`) REFERENCES `inscriptions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `couples`
--

DROP TABLE IF EXISTS `couples`;
CREATE TABLE `couples` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_player1` int NOT NULL,
  `id_player2` int NOT NULL,
  `id_club` int NOT NULL,
  `points` int NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_player1` (`id_player1`),
  KEY `id_player2` (`id_player2`),
  KEY `id_club` (`id_club`),
  CONSTRAINT `couples_ibfk_1` FOREIGN KEY (`id_player1`) REFERENCES `players` (`id`),
  CONSTRAINT `couples_ibfk_2` FOREIGN KEY (`id_player2`) REFERENCES `players` (`id`),
  CONSTRAINT `couples_ibfk_3` FOREIGN KEY (`id_club`) REFERENCES `clubs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `federations`
--

DROP TABLE IF EXISTS `federations`;
CREATE TABLE `federations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `nickname` varchar(100) NOT NULL,
  `id_province` int NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `id_province` (`id_province`),
  CONSTRAINT `federations_ibfk_1` FOREIGN KEY (`id_province`) REFERENCES `provinces` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `inscriptions`
--

DROP TABLE IF EXISTS `inscriptions`;
CREATE TABLE `inscriptions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_tournament` int NOT NULL,
  `id_couple` int NOT NULL,
  `observation` varchar(500) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_created` int NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_updated` int NOT NULL,
  `status_payment` enum('PENDING','PAID') NOT NULL DEFAULT 'PENDING',
  `id_category` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_tournament` (`id_tournament`),
  KEY `user_created` (`user_created`),
  KEY `user_updated` (`user_updated`),
  KEY `id_category` (`id_category`),
  KEY `inscriptions_ibfk_2` (`id_couple`),
  CONSTRAINT `inscriptions_ibfk_1` FOREIGN KEY (`id_tournament`) REFERENCES `tournaments` (`id`),
  CONSTRAINT `inscriptions_ibfk_2` FOREIGN KEY (`id_couple`) REFERENCES `couples` (`id`) ON DELETE CASCADE,
  CONSTRAINT `inscriptions_ibfk_3` FOREIGN KEY (`user_created`) REFERENCES `users` (`id`),
  CONSTRAINT `inscriptions_ibfk_4` FOREIGN KEY (`user_updated`) REFERENCES `users` (`id`),
  CONSTRAINT `inscriptions_ibfk_5` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `matches`
--

DROP TABLE IF EXISTS `matches`;
CREATE TABLE `matches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_tournament` int NOT NULL,
  `id_category` int NOT NULL,
  `id_couple1` int DEFAULT NULL,
  `points_couple1` int DEFAULT NULL,
  `id_couple2` int DEFAULT NULL,
  `points_couple2` int DEFAULT NULL,
  `match` tinyint(1) NOT NULL,
  `rival1` varchar(10) DEFAULT NULL,
  `rival2` varchar(10) DEFAULT NULL,
  `zone` varchar(20) NOT NULL,
  `day` enum('MIERCOLES','JUEVES','VIERNES','SABADO','DOMINGO') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `id_club` int DEFAULT NULL,
  `hour` time DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_drop` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_drop` (`id_tournament`,`id_category`,`zone`,`match`),
  KEY `fk_zones_tournament_idx` (`id_tournament`),
  KEY `fk_zones_category_idx` (`id_category`),
  KEY `fk_zones_couple1_idx` (`id_couple1`),
  KEY `fk_zones_couple2_idx` (`id_couple2`),
  KEY `fk_zones_club_idx` (`id_club`),
  CONSTRAINT `fk_zones_category` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id`),
  CONSTRAINT `fk_zones_club` FOREIGN KEY (`id_club`) REFERENCES `clubs` (`id`),
  CONSTRAINT `fk_zones_couple1` FOREIGN KEY (`id_couple1`) REFERENCES `couples` (`id`),
  CONSTRAINT `fk_zones_couple2` FOREIGN KEY (`id_couple2`) REFERENCES `couples` (`id`),
  CONSTRAINT `fk_zones_tournament` FOREIGN KEY (`id_tournament`) REFERENCES `tournaments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entity` enum('MP','MACRO') NOT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `external_id` varchar(255) DEFAULT NULL,
  `type` enum('AFILIACION','INSCRIPCION') NOT NULL,
  `amount` float(11,2) NOT NULL,
  `id_user` int NOT NULL,
  `status` tinyint DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `players`
--

DROP TABLE IF EXISTS `players`;
CREATE TABLE `players` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_category` int NOT NULL,
  `possition` enum('DRIVE','REVES') DEFAULT NULL,
  `hand` enum('DERECHA','IZQUIERDA') DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `afiliation` tinyint(1) NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_updated` int DEFAULT NULL,
  `id_club` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_club` (`id_club`),
  KEY `id_user` (`id_user`),
  KEY `id_category` (`id_category`),
  KEY `user_updated` (`user_updated`),
  CONSTRAINT `players_ibfk_1` FOREIGN KEY (`id_club`) REFERENCES `clubs` (`id`),
  CONSTRAINT `players_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`),
  CONSTRAINT `players_ibfk_3` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id`),
  CONSTRAINT `players_ibfk_4` FOREIGN KEY (`user_updated`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `provinces`
--

DROP TABLE IF EXISTS `provinces`;
CREATE TABLE `provinces` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `ranking`
--

DROP TABLE IF EXISTS `ranking`;
CREATE TABLE `ranking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_player` int NOT NULL,
  `points` int NOT NULL,
  `id_federation` int NOT NULL,
  `id_category` int NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `year` int NOT NULL,
  `user_updated` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `gender` enum('F','X') DEFAULT NULL,
  `sanctions` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_updated` (`user_updated`),
  KEY `id_player` (`id_player`),
  KEY `id_federation` (`id_federation`),
  KEY `id_category` (`id_category`),
  CONSTRAINT `ranking_ibfk_1` FOREIGN KEY (`user_updated`) REFERENCES `users` (`id`),
  CONSTRAINT `ranking_ibfk_2` FOREIGN KEY (`id_player`) REFERENCES `players` (`id`),
  CONSTRAINT `ranking_ibfk_3` FOREIGN KEY (`id_federation`) REFERENCES `federations` (`id`),
  CONSTRAINT `ranking_ibfk_4` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `result_match`
--

DROP TABLE IF EXISTS `result_match`;
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
  UNIQUE KEY `uq_result_match` (`id_match`,`match_type`),
  KEY `user_created` (`user_created`),
  KEY `user_updated` (`user_updated`),
  CONSTRAINT `result_match_ibfk_3` FOREIGN KEY (`user_created`) REFERENCES `users` (`id`),
  CONSTRAINT `result_match_ibfk_4` FOREIGN KEY (`user_updated`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `sanctions`
--

DROP TABLE IF EXISTS `sanctions`;
CREATE TABLE `sanctions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_player` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_start` date NOT NULL,
  `date_end` date NOT NULL,
  `id_federation` int NOT NULL,
  `type_sanction` int NOT NULL,
  `created_user` int NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_updated` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_player` (`id_player`),
  KEY `id_federation` (`id_federation`),
  KEY `type_sanction` (`type_sanction`),
  KEY `created_user` (`created_user`),
  KEY `user_updated` (`user_updated`),
  CONSTRAINT `sanctions_ibfk_1` FOREIGN KEY (`id_player`) REFERENCES `players` (`id`),
  CONSTRAINT `sanctions_ibfk_2` FOREIGN KEY (`id_federation`) REFERENCES `federations` (`id`),
  CONSTRAINT `sanctions_ibfk_3` FOREIGN KEY (`type_sanction`) REFERENCES `type_sanctions` (`id`),
  CONSTRAINT `sanctions_ibfk_4` FOREIGN KEY (`created_user`) REFERENCES `users` (`id`),
  CONSTRAINT `sanctions_ibfk_5` FOREIGN KEY (`user_updated`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `tournament_categories`
--

DROP TABLE IF EXISTS `tournament_categories`;
CREATE TABLE `tournament_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_tournament` int NOT NULL,
  `id_category` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_created` int NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_updated` int DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `id_tournament` (`id_tournament`),
  KEY `id_category` (`id_category`),
  KEY `user_created` (`user_created`),
  KEY `user_updated` (`user_updated`),
  CONSTRAINT `tournament_categories_ibfk_1` FOREIGN KEY (`id_tournament`) REFERENCES `tournaments` (`id`),
  CONSTRAINT `tournament_categories_ibfk_2` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id`),
  CONSTRAINT `tournament_categories_ibfk_3` FOREIGN KEY (`user_created`) REFERENCES `users` (`id`),
  CONSTRAINT `tournament_categories_ibfk_4` FOREIGN KEY (`user_updated`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `tournament_clubs`
--

DROP TABLE IF EXISTS `tournament_clubs`;
CREATE TABLE `tournament_clubs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_tournament` int NOT NULL,
  `id_club` int NOT NULL,
  `main_club` tinyint NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_created` int NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_updated` int DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `id_tournament` (`id_tournament`),
  KEY `id_club` (`id_club`),
  KEY `user_created` (`user_created`),
  KEY `user_updated` (`user_updated`),
  CONSTRAINT `tournament_clubs_ibfk_1` FOREIGN KEY (`id_tournament`) REFERENCES `tournaments` (`id`),
  CONSTRAINT `tournament_clubs_ibfk_2` FOREIGN KEY (`id_club`) REFERENCES `clubs` (`id`),
  CONSTRAINT `tournament_clubs_ibfk_3` FOREIGN KEY (`user_created`) REFERENCES `users` (`id`),
  CONSTRAINT `tournament_clubs_ibfk_4` FOREIGN KEY (`user_updated`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `tournaments`
--

DROP TABLE IF EXISTS `tournaments`;
CREATE TABLE `tournaments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `id_federation` int NOT NULL,
  `date_start` date NOT NULL,
  `date_end` date NOT NULL,
  `date_inscription_start` datetime NOT NULL,
  `date_inscription_end` datetime NOT NULL,
  `max_couples` int NOT NULL,
  `gender` enum('M','F','O') NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `ranked` tinyint(1) DEFAULT '1',
  `afiliation_required` tinyint(1) NOT NULL DEFAULT '1',
  `type_tournament` enum('PARTICULAR','FEDERADO','MASTER') DEFAULT NULL,
  `public` int DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_created` int NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_updated` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_federation` (`id_federation`),
  KEY `user_created` (`user_created`),
  KEY `user_updated` (`user_updated`),
  CONSTRAINT `tournaments_ibfk_1` FOREIGN KEY (`id_federation`) REFERENCES `federations` (`id`),
  CONSTRAINT `tournaments_ibfk_2` FOREIGN KEY (`user_created`) REFERENCES `users` (`id`),
  CONSTRAINT `tournaments_ibfk_3` FOREIGN KEY (`user_updated`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `type_sanctions`
--

DROP TABLE IF EXISTS `type_sanctions`;
CREATE TABLE `type_sanctions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `user_created` int NOT NULL,
  `user_updated` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_created` (`user_created`),
  KEY `user_updated` (`user_updated`),
  CONSTRAINT `type_sanctions_ibfk_1` FOREIGN KEY (`user_created`) REFERENCES `users` (`id`),
  CONSTRAINT `type_sanctions_ibfk_2` FOREIGN KEY (`user_updated`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `type_users`
--

DROP TABLE IF EXISTS `type_users`;
CREATE TABLE `type_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `user_club`
--

DROP TABLE IF EXISTS `user_club`;
CREATE TABLE `user_club` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_club` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_user` (`id_user`),
  KEY `id_club` (`id_club`),
  CONSTRAINT `user_club_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`),
  CONSTRAINT `user_club_ibfk_2` FOREIGN KEY (`id_club`) REFERENCES `clubs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `cell_phone` char(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `type_document` enum('LE','DNI','CI') NOT NULL,
  `number_document` char(9) NOT NULL,
  `gender` enum('M','F','O') NOT NULL,
  `id_city` int NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `type_user` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_updated` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `type_user` (`type_user`),
  KEY `id_city` (`id_city`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`type_user`) REFERENCES `type_users` (`id`),
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`id_city`) REFERENCES `cities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;
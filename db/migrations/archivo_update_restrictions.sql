ALTER TABLE category_restrictions ADD COLUMN category_gender ENUM('M', 'F', 'O') NOT NULL;
ALTER TABLE category_restrictions ADD COLUMN authorized_category_gender ENUM('M', 'F', 'O') NOT NULL;

INSERT INTO category_restrictions (id_category,category_gender, id_authorized_category, authorized_category_gender)
VALUES (1, "M", 2, "F");

INSERT INTO category_restrictions (id_category,category_gender, id_authorized_category, authorized_category_gender)
VALUES (4, "M", 2, "F");

INSERT INTO category_restrictions (id_category,category_gender, id_authorized_category, authorized_category_gender)
VALUES (4, "M", 3, "F");

INSERT INTO category_restrictions (id_category,category_gender, id_authorized_category, authorized_category_gender)
VALUES (5, "M", 3, "F");

INSERT INTO category_restrictions (id_category,category_gender, id_authorized_category, authorized_category_gender)
VALUES (5, "M", 4, "F");

INSERT INTO category_restrictions (id_category,category_gender, id_authorized_category, authorized_category_gender)
VALUES (6, "M", 4, "F");

INSERT INTO category_restrictions (id_category,category_gender, id_authorized_category, authorized_category_gender)
VALUES (6, "M", 5, "F");

INSERT INTO category_restrictions (id_category,category_gender, id_authorized_category, authorized_category_gender)
VALUES (7, "M", 5, "F");

INSERT INTO category_restrictions (id_category,category_gender, id_authorized_category, authorized_category_gender)
VALUES (7, "M", 6, "F");

INSERT INTO category_restrictions (id_category,category_gender, id_authorized_category, authorized_category_gender)
VALUES (8, "M", 6, "F");

INSERT INTO category_restrictions (id_category,category_gender, id_authorized_category, authorized_category_gender)
VALUES (8, "M", 7, "F");



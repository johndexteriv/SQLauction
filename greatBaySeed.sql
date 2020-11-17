DROP DATABASE IF EXISTS auction_db;

CREATE DATABASE auction_db;

USE auction_db;

CREATE TABLE listings (
  id INT NOT NULL AUTO_INCREMENT,
  item VARCHAR(50) NOT NULL,
  currentbid INT DEFAULT (10) NOT NULL,
  highestbid INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO listings (item, currentbid)
VALUES ("PS5", 2000), ("old thinkpad", 480)
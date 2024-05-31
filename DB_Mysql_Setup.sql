-- prepares a MySQL server for initialization

CREATE DATABASE IF NOT EXISTS pawscribe;
CREATE USER IF NOT EXISTS 'hucks'@'localhost' IDENTIFIED BY 'hucks';
GRANT ALL PRIVILEGES ON `pawscribe`.* TO 'hucks'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'hucks'@'localhost';
FLUSH PRIVILEGES;
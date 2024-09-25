-- Prepares a MySQL server for initialization
CREATE DATABASE IF NOT EXISTS pawscribe;
CREATE USER IF NOT EXISTS 'pawscribe_user'@'%' IDENTIFIED BY 'pawscribe_pass';
GRANT ALL PRIVILEGES ON pawscribe.* TO 'pawscribe_user'@'%';
GRANT SELECT ON performance_schema.* TO 'pawscribe_user'@'%';
FLUSH PRIVILEGES;
-- Prepares a MySQL server for initialization
CREATE DATABASE IF NOT EXISTS pawscribe;
CREATE USER IF NOT EXISTS $(PAWSCRIBE_USER)@'%' IDENTIFIED BY $(PAWSCRIBE_PASS);
GRANT ALL PRIVILEGES ON pawscribe.* TO $(PAWSCRIBE_USER)@'%';
GRANT SELECT ON performance_schema.* TO $(PAWSCRIBE_USER)@'%';
FLUSH PRIVILEGES;
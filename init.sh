#!/bin/bash
# create required mysql db
set -a
[ -f $(pwd)/.env ] && source .env
set +a;
# Create Db in Silence
(mysql  -u$MYSQL_ADMIN_USER --password=$MYSQL_ADMIN_PASSWORD  < DB_Mysql_Setup.sql) &&
# Wait till last background job is done
#wait $!
if (($? == 0))
then
    echo "db pawscribe and pawscribe db_user is Now Available"
fi &&
bash ./install.sh; 
#!/usr/local/bin/bash
unset DB_TYP &&
DB_INSTANCE=$(pwd)/db/DB_INSTANCE &&
if [ -d "$DB_INSTANCE" ]; then
 rm -rf $DB_INSTANCE
fi && 
find . -type d -name "__pycache__" -exec rm -rf {} +

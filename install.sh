#!/bin/bash
python3 -m venv .venv &&
source .venv/bin/activate &&
python3 -m pip install -r requirements.txt && 
# install Docker daemon on Ubuntu Linux (production mode)
if (($APP_INSTANCE == "production" ))
then 
    bash ./docker.sh &&
    service docker start
fi;
   
    

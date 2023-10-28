#!/bin/bash

OPTION=$1
DATABASE="./config/database.json"
APP="./app/app.js"
GUI="./gui"

if [ "$OPTION" == "up" ]
then
    # database
    fuser -k 8000/tcp || true
    # middle-end
    fuser -k 8001/tcp 8002/tcp 8003/tcp 8004/tcp 8005/tcp 8006/tcp || true
    # front-end
    fuser -k 3001/tcp 3002/tcp 3003/tcp 3004/tcp 3005/tcp 3006/tcp || true
    # database
    npx json-server --watch "$DATABASE" --port 8000 &
    # middle-end
    node "$APP" 8001 &
    node "$APP" 8002 &
    node "$APP" 8003 &
    node "$APP" 8004 &
    node "$APP" 8005 &
    node "$APP" 8006 &
    # front-end
    export PORT=3001; REACT_APP_BACKEND_PORT=8001 npm run --prefix "$GUI" start &
    export PORT=3002; REACT_APP_BACKEND_PORT=8002 npm run --prefix "$GUI" start &
    export PORT=3003; REACT_APP_BACKEND_PORT=8003 npm run --prefix "$GUI" start &
    export PORT=3004; REACT_APP_BACKEND_PORT=8004 npm run --prefix "$GUI" start &
    export PORT=3005; REACT_APP_BACKEND_PORT=8005 npm run --prefix "$GUI" start &
    export PORT=3006; REACT_APP_BACKEND_PORT=8006 npm run --prefix "$GUI" start &
elif [ "$OPTION" == "down" ] 
then
    # database
    fuser -k 8000/tcp || true
    # middle-end
    fuser -k 8001/tcp 8002/tcp 8003/tcp 8004/tcp 8005/tcp 8006/tcp || true
    # front-end
    fuser -k 3001/tcp 3002/tcp 3003/tcp 3004/tcp 3005/tcp 3006/tcp || true
else
    echo "Help:
            ./host.sh up
            ./host.sh down"
fi

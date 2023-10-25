#!/bin/bash

OPTION=$1
TESTNET="../test-network/network.sh"
CHAINCODE="../BTP/chaincode"
COLLECTIONS="../BTP/config/collections.json"
DATABASE="./config/database.json"
DBPORT=8000
CCEP="OR('Org1MSP.member','Org2MSP.member')"
WALLET="./config/wallet"

if [ "$OPTION" == "launch" ]
then
    npx json-server --watch "$DATABASE" --port "$DBPORT" &
    "$TESTNET" down
    rm -rf "$WALLET"
    "$TESTNET" up -ca
    "$TESTNET" createChannel
    "$TESTNET" deployCC -ccn chaincode -ccp "$CHAINCODE" -ccl go -cccg "$COLLECTIONS" -ccep "$CCEP" 
elif [ "$OPTION" == "kill" ] 
then
    "$TESTNET" down
    rm -rf "$WALLET"
else
    echo "Help:
            ./run.sh launch
            ./run.sh kill"
fi

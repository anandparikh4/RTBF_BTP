package main

import (
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// smart contract
type Smart_Contract struct {
	contractapi.Contract
}

// record information
// key: ID | value: Hospital, Patient, Test, Result, Allergies, Blood
type Record struct {
	ID        string `json:"ID"` // h[{Hospital}_h{Patient}_h{Test}]
	Hospital  string `json:"Hospital"`
	Patient   string `json:"Patient"`
	Test      string `json:"Test"`
	Result    string `json:"Result"`
	Allergies string `json:"Allergies"`
	Blood     string `json:"Blood"`
}

// access control list
// key: ID | value : Hospital, Patient, Read_Access_List, Write_Access_List
type Access_Control_List struct {
	ID                string   `json:"ID"` // h[{Hospital}_{Patient}_{Test}]_ACL
	H_Hospital        []byte   `json:"H_Hospital"`
	H_Patient         []byte   `json:"H_Patient"`
	Read_Access_List  []string `json:"Read_Access_List"`
	Write_Access_List []string `json:"Write_Access_List"`
}

func (s *Smart_Contract) Init_Ledger(ctx contractapi.TransactionContextInterface) error {
	return nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(Smart_Contract))
	if err != nil {
		fmt.Printf("error creating chaincode")
		return
	}
	err = chaincode.Start()
	if err != nil {
		fmt.Printf("error starting chaincode")
		return
	}
}

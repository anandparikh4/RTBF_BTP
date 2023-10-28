package main

import (
	"bytes"
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

func (s *Smart_Contract) Write_Private_Data(ctx contractapi.TransactionContextInterface) error {
	// verify permission
	permission, err := verify_Permission(ctx, "Write_Private_Data")
	if err != nil {
		return fmt.Errorf("<Write_Private_Data> verify permission failed: %v", err)
	}
	if !permission {
		return fmt.Errorf("<Write_Private_Data> this user type cannot execute requested action")
	}
	// get info from transient input
	type Input struct {
		Hospital  string `json:"hospital"`
		Patient   string `json:"patient"`
		Test      string `json:"test"`
		Result    string `json:"result"`
		Allergies string `json:"allergies"`
		Blood     string `json:"blood"`
	}
	transient, err := ctx.GetStub().GetTransient()
	if err != nil {
		return fmt.Errorf("<Write_Private_Data> get transient failed: %v", err)
	}
	inputJSON, exists := transient["info"]
	if !exists {
		return fmt.Errorf("<Write_Private_Data> info not passed")
	}
	var input Input
	err = json.Unmarshal(inputJSON, &input)
	if err != nil {
		return fmt.Errorf("<Write_Private_Data> unmarshal input failed: %v", err)
	}
	// check if the submitter is allowed to write to the requested key
	key := get_String_Hash(input.Hospital + "_" + input.Patient + "_" + input.Test)
	access, err := verify_Access_Control(ctx, key, "w")
	if err != nil {
		return fmt.Errorf("<Write_Private_Data> verify access control failed: %v", err)
	}
	if !access {
		return fmt.Errorf("<Write_Private_Data> write access denied")
	}
	// write to the collection
	collection := "explicit_" + input.Hospital
	var record Record
	record.ID = key
	record.Hospital = input.Hospital
	record.Patient = input.Patient
	record.Test = input.Test
	record.Result = input.Result
	record.Allergies = input.Allergies
	record.Blood = input.Blood
	exists = true
	recordJSON, err := ctx.GetStub().GetPrivateData(collection, record.ID)
	if err != nil {
		return fmt.Errorf("<Write_Private_Data> get private data record failed: %v", err)
	}
	if recordJSON == nil {
		exists = false
	}
	recordJSON, err = json.Marshal(record)
	if err != nil {
		return fmt.Errorf("<Write_Private_Data> marshal record failed: %v", err)
	}
	err = ctx.GetStub().PutPrivateData(collection, record.ID, recordJSON)
	if err != nil {
		return fmt.Errorf("<Write_Private_Data> put private data record failed: %v", err)
	}
	// in case it is a write to a previously non-existent key, override the chaincode-level endorsement policy with state-based endorsement policy
	if !exists {
		endorsers := []string{record.Hospital}
		err = set_Endorsement_Policy(ctx, record.ID, endorsers)
		if err != nil {
			return fmt.Errorf("<Write_Private_Data> set endorsement policy failed: %v", err)
		}
	}
	return nil
}

func (s *Smart_Contract) Read_Private_Data(ctx contractapi.TransactionContextInterface) (Record, error) {
	// verify permission
	permission, err := verify_Permission(ctx, "Read_Private_Data")
	if err != nil {
		return Record{}, fmt.Errorf("<Read_Private_Data> verify permission failed: %v", err)
	}
	if !permission {
		return Record{}, fmt.Errorf("<Read_Private_Data> this user type cannot execute requested action")
	}
	// get info from transient input
	type Input struct {
		Hospital string `json:"hospital"`
		Patient  string `json:"patient"`
		Test     string `json:"test"`
	}
	transient, err := ctx.GetStub().GetTransient()
	if err != nil {
		return Record{}, fmt.Errorf("<Read_Private_Data> get transient failed: %v", err)
	}
	inputJSON, exists := transient["info"]
	if !exists {
		return Record{}, fmt.Errorf("<Read_Private_Data> info not passed")
	}
	var input Input
	err = json.Unmarshal(inputJSON, &input)
	if err != nil {
		return Record{}, fmt.Errorf("<Read_Private_Data> unmarshal input failed: %v", err)
	}
	// check if the submitter is allowed to read from the requested key
	key := get_String_Hash(input.Hospital + "_" + input.Patient + "_" + input.Test)
	access, err := verify_Access_Control(ctx, key, "r")
	if err != nil {
		return Record{}, fmt.Errorf("<Read_Private_Data> verify access control failed: %v", err)
	}
	if !access {
		return Record{}, fmt.Errorf("<Read_Private_Data> read access denied")
	}
	// read from the collection
	collection := "explicit_" + input.Hospital
	recordJSON, err := ctx.GetStub().GetPrivateData(collection, key)
	if err != nil {
		return Record{}, fmt.Errorf("<Read_Private_Data> get private data record failed: %v", err)
	}
	if recordJSON == nil {
		return Record{}, fmt.Errorf("<Read_Private_Data> record does not exist")
	}
	// check if the on-chain (public) and off-chain (private) hashes are equal
	private_hash := get_Byte_Hash(recordJSON)
	public_hash, err := ctx.GetStub().GetPrivateDataHash(collection, key)
	if err != nil {
		return Record{}, fmt.Errorf("<Read_Private_Data> get private data hash record failed: %v", err)
	}
	if !bytes.Equal(private_hash, public_hash) {
		return Record{}, fmt.Errorf("<Read_Private_Data> private and public hashes of the record do not match")
	}
	var record Record
	err = json.Unmarshal(recordJSON, &record)
	if err != nil {
		return Record{}, fmt.Errorf("<Read_Private_Data> unmarshal record failed: %v", err)
	}
	return record, nil
}

func (s *Smart_Contract) Destroy_Private_Data(ctx contractapi.TransactionContextInterface) error {
	// verify permission
	permission, err := verify_Permission(ctx, "Destroy_Private_Data")
	if err != nil {
		return fmt.Errorf("<Destroy_Private_Data> verify permission failed: %v", err)
	}
	if !permission {
		return fmt.Errorf("<Destroy_Private_Data> this user type cannot execute requested action")
	}
	// get info from transient input
	type Input struct {
		Patient string `json:"patient"`
		Test    string `json:"test"`
	}
	transient, err := ctx.GetStub().GetTransient()
	if err != nil {
		return fmt.Errorf("<Destroy_Private_Data> get transient failed: %v", err)
	}
	inputJSON, exists := transient["key"]
	if !exists {
		return fmt.Errorf("<Destroy_Private_Data> key not passed")
	}
	var input Input
	err = json.Unmarshal(inputJSON, &input)
	if err != nil {
		return fmt.Errorf("<Destroy_Private_Data> unmarshal input failed: %v", err)
	}
	// get the key to destroy
	OrgMSP, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("<Destroy_Private_Data> get client mspid failed: %v", err)
	}
	hospital := "Hospital" + OrgMSP[3:len(OrgMSP)-3]
	key := get_String_Hash(hospital + "_" + input.Patient + "_" + input.Test)
	collection := "explicit_" + hospital
	// check if key exists
	recordJSON, err := ctx.GetStub().GetPrivateData(collection, key)
	if err != nil {
		return fmt.Errorf("<Destroy_Private_Data> get private data failed: %v", err)
	}
	if recordJSON == nil {
		return fmt.Errorf("<Destroy_Private_Data> record does not exist")
	}
	err = ctx.GetStub().DelPrivateData(collection, key) /// change to PurgePrivateData if possible
	if err != nil {
		return fmt.Errorf("<Destroy_Private_Data> del private data failed: %v", err)
	}
	return nil
}

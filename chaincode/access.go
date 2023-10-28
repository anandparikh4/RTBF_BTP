package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// construct acl for the given patient and test
func (s *Smart_Contract) Construct_ACL(ctx contractapi.TransactionContextInterface) error {
	// verify permission
	permission, err := verify_Permission(ctx, "Construct_ACL")
	if err != nil {
		return fmt.Errorf("<Construct_ACL> verify permission failed: %v", err)
	}
	if !permission {
		return fmt.Errorf("<Construct_ACL> this user type cannot execute requested action")
	}
	// get info from transient input
	type Input struct {
		Patient string `json:"patient"`
		Test    string `json:"test"`
	}
	transient, err := ctx.GetStub().GetTransient()
	if err != nil {
		return fmt.Errorf("<Construct_ACL> get transient failed: %v", err)
	}
	inputJSON, exists := transient["key"]
	if !exists {
		return fmt.Errorf("<Construct_ACL> key not passed")
	}
	var input Input
	err = json.Unmarshal(inputJSON, &input)
	if err != nil {
		return fmt.Errorf("<Construct_ACL> unmarshal input failed: %v", err)
	}
	patient := input.Patient
	test := input.Test
	// get hospital from msp
	OrgMSP, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("<Construct_ACL> get client mspid failed: %v", err)
	}
	hospital := "Hospital" + OrgMSP[3:len(OrgMSP)-3]
	// check if acl exists
	id := get_String_Hash(hospital+"_"+patient+"_"+test) + "_ACL"
	aclJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return fmt.Errorf("<Construct_ACL> get state acl failed: %v", err)
	}
	if aclJSON != nil {
		return fmt.Errorf("<Construct_ACL> acl already exists")
	}
	// construct the acl
	var acl Access_Control_List
	acl.ID = id
	acl.H_Hospital = get_Byte_Hash([]byte(hospital))
	acl.H_Patient = get_Byte_Hash([]byte(patient))
	aclJSON, err = json.Marshal(acl)
	if err != nil {
		return fmt.Errorf("<Construct_ACL> marshal acl failed: %v", err)
	}
	err = ctx.GetStub().PutState(acl.ID, aclJSON)
	if err != nil {
		return fmt.Errorf("<Construct_ACL> put state acl failed: %v", err)
	}
	return err
}

func (s *Smart_Contract) Destruct_ACL(ctx contractapi.TransactionContextInterface) error {
	// verify permission
	permission, err := verify_Permission(ctx, "Destruct_ACL")
	if err != nil {
		return fmt.Errorf("<Destruct_ACL> verify permission failed: %v", err)
	}
	if !permission {
		return fmt.Errorf("<Destruct_ACL> this user type cannot execute requested action")
	}
	// get info from transient input
	type Input struct {
		Patient string `json:"patient"`
		Test    string `json:"test"`
	}
	transient, err := ctx.GetStub().GetTransient()
	if err != nil {
		return fmt.Errorf("<Destruct_ACL> get transient failed: %v", err)
	}
	inputJSON, exists := transient["key"]
	if !exists {
		return fmt.Errorf("<Destruct_ACL> key not passed")
	}
	var input Input
	err = json.Unmarshal(inputJSON, &input)
	if err != nil {
		return fmt.Errorf("<Destruct_ACL> unmarshal input failed: %v", err)
	}
	patient := input.Patient
	test := input.Test
	// get hospital from msp
	OrgMSP, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("<Destruct_ACL> get client mspid failed: %v", err)
	}
	hospital := "Hospital" + OrgMSP[3:len(OrgMSP)-3]
	// check if acl exists
	id := get_String_Hash(hospital+"_"+patient+"_"+test) + "_ACL"
	aclJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return fmt.Errorf("<Destruct_ACL> get state acl failed: %v", err)
	}
	if aclJSON == nil {
		return fmt.Errorf("<Destruct_ACL> acl does not exist")
	}
	// destruct the acl
	err = ctx.GetStub().DelState(id)
	if err != nil {
		return fmt.Errorf("<Destruct_ACL> del state acl failed: %v", err)
	}
	return nil
}

func (s *Smart_Contract) Grant_Access_Control(ctx contractapi.TransactionContextInterface) error {
	// verify permission
	permission, err := verify_Permission(ctx, "Grant_Access_Control")
	if err != nil {
		return fmt.Errorf("<Grant_Access_Control> verify permission failed: %v", err)
	}
	if !permission {
		return fmt.Errorf("<Grant_Access_Control> this user type cannot execute requested action")
	}
	// get info from transient input
	type Input struct {
		Patient  string `json:"patient"`
		Test     string `json:"test"`
		Hospital string `json:"hospital"`
		Manner   string `json:"manner"`
	}
	transient, err := ctx.GetStub().GetTransient()
	if err != nil {
		return fmt.Errorf("<Grant_Access_Control> get transient failed: %v", err)
	}
	inputJSON, exists := transient["access"]
	if !exists {
		return fmt.Errorf("<Grant_Access_Control> access not passed")
	}
	var input Input
	err = json.Unmarshal(inputJSON, &input)
	if err != nil {
		return fmt.Errorf("<Grant_Access_Control> unmarshal input failed: %v", err)
	}
	patient := input.Patient
	test := input.Test
	client_hospital := input.Hospital
	manner := input.Manner
	// get server_hospital from msp
	OrgMSP, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("<Grant_Access_Control> get client mspid failed: %v", err)
	}
	server_hospital := "Hospital" + OrgMSP[3:len(OrgMSP)-3]
	// check if acl exists
	id := get_String_Hash(server_hospital+"_"+patient+"_"+test) + "_ACL"
	aclJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return fmt.Errorf("<Grant_Access_Control> get state acl failed: %v", err)
	}
	if aclJSON == nil {
		return fmt.Errorf("<Grant_Access_Control> acl does not exist")
	}
	// grant access to client_hospital
	var acl Access_Control_List
	err = json.Unmarshal(aclJSON, &acl)
	if err != nil {
		return fmt.Errorf("<Grant_Access_Control> unmarshal acl failed: %v", err)
	}
	if manner == "r" || manner == "rw" {
		acl.Read_Access_List = insert_List(acl.Read_Access_List, client_hospital)
	}
	if manner == "w" || manner == "rw" {
		acl.Write_Access_List = insert_List(acl.Write_Access_List, client_hospital)
	}
	if manner != "r" && manner != "w" && manner != "rw" {
		return fmt.Errorf("<Grant_Access_Control> invalid manner of access control %v is none of r/w/rw", manner)
	}
	aclJSON, err = json.Marshal(acl)
	if err != nil {
		return fmt.Errorf("<Grant_Access_Control> marshal acl failed: %v", err)
	}
	err = ctx.GetStub().PutState(acl.ID, aclJSON)
	if err != nil {
		return fmt.Errorf("<Grant_Access_Control> put state acl failed: %v", err)
	}
	return nil
}

func (s *Smart_Contract) Revoke_Access_Control(ctx contractapi.TransactionContextInterface) error {
	// verify permission
	permission, err := verify_Permission(ctx, "Revoke_Access_Control")
	if err != nil {
		return fmt.Errorf("<Revoke_Access_Control> verify permission failed: %v", err)
	}
	if !permission {
		return fmt.Errorf("<Revoke_Access_Control> this user type cannot execute requested action")
	}
	// get info from transient input
	type Input struct {
		Patient  string `json:"patient"`
		Test     string `json:"test"`
		Hospital string `json:"hospital"`
		Manner   string `json:"manner"`
	}
	transient, err := ctx.GetStub().GetTransient()
	if err != nil {
		return fmt.Errorf("<Revoke_Access_Control> get transient failed: %v", err)
	}
	inputJSON, exists := transient["access"]
	if !exists {
		return fmt.Errorf("<Revoke_Access_Control> access not passed")
	}
	var input Input
	err = json.Unmarshal(inputJSON, &input)
	if err != nil {
		return fmt.Errorf("<Revoke_Access_Control> unmarshal input failed: %v", err)
	}
	patient := input.Patient
	test := input.Test
	client_hospital := input.Hospital
	manner := input.Manner
	// get server hospital from mspid
	OrgMSP, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("<Revoke_Access_Control> get client mspid failed: %v", err)
	}
	server_hospital := "Hospital" + OrgMSP[3:len(OrgMSP)-3]
	// check if acl exists
	id := get_String_Hash(server_hospital+"_"+patient+"_"+test) + "_ACL"
	aclJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return fmt.Errorf("<Revoke_Access_Control> get state acl failed: %v", err)
	}
	if aclJSON == nil {
		return fmt.Errorf("<Revoke_Access_Control> acl does not exist: %v", err)
	}
	// revoke access control from client_hospital
	var acl Access_Control_List
	err = json.Unmarshal(aclJSON, &acl)
	if err != nil {
		return fmt.Errorf("<Revoke_Access_Control> unmarshal acl failed: %v", err)
	}
	if manner == "r" || manner == "rw" {
		acl.Read_Access_List = delete_List(acl.Read_Access_List, client_hospital)
	}
	if manner == "w" || manner == "rw" {
		acl.Write_Access_List = delete_List(acl.Write_Access_List, client_hospital)
	}
	if manner != "r" && manner != "w" && manner != "rw" {
		return fmt.Errorf("<Revoke_Access_Control> invalid manner of access control %v is none of r/w/rw", err)
	}
	aclJSON, err = json.Marshal(acl)
	if err != nil {
		return fmt.Errorf("<Revoke_Access_Control> marshal acl failed: %v", err)
	}
	err = ctx.GetStub().PutState(acl.ID, aclJSON)
	if err != nil {
		return fmt.Errorf("<Revoke_Access_Control> put state acl failed")
	}
	return nil
}

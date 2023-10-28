package main

import (
	"crypto/md5"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/hyperledger/fabric-chaincode-go/pkg/cid"
	"github.com/hyperledger/fabric-chaincode-go/pkg/statebased"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// insert to list
func insert_List(list []string, element string) []string {
	var found bool = false
	for _, val := range list {
		if val == element {
			found = true
			break
		}
	}
	if !found {
		list = append(list, element)
	}
	return list
}

// delete from list
func delete_List(list []string, element string) []string {
	var found int = -1
	for idx, val := range list {
		if val == element {
			found = idx
			break
		}
	}
	if found != -1 {
		list = append(list[:found], list[found+1:]...)
	}
	return list
}

// find in list
func find_List(list []string, element string) bool {
	var found bool = false
	for _, val := range list {
		if val == element {
			found = true
			break
		}
	}
	return found
}

func get_String_Hash(text string) string {
	hasher := md5.New()
	hasher.Write([]byte(text))
	return hex.EncodeToString(hasher.Sum(nil))
}

func get_Byte_Hash(b []byte) []byte {
	hash := sha256.New()
	hash.Write(b)
	h := hash.Sum(nil)
	return h
}

// check if the submitter is allowed to call a certain function
func verify_Permission(ctx contractapi.TransactionContextInterface, func_name string) (bool, error) {
	admin_permissions := []string{"Construct_ACL", "Destruct_ACL", "Read_Private_Data", "Write_Private_Data"}
	patient_permissions := []string{"Grant_Access_Control", "Revoke_Access_Control", "Read_Private_Data", "Destroy_Private_Data"}
	attr, exists, err := cid.GetAttributeValue(ctx.GetStub(), "ClientID")
	if err != nil {
		return false, fmt.Errorf("<verify_Permission> get attribute value failed: %v", err)
	}
	if !exists { // admin
		permission := find_List(admin_permissions, func_name)
		return permission, nil
	} else if strings.HasPrefix(attr, "patient") {
		permission := find_List(patient_permissions, func_name)
		return permission, nil
	}
	return false, fmt.Errorf("<verify_Permission> invalid type %v is none of admin/patient", attr)
}

// add the owner org to the state-based endorsement policy
func set_Endorsement_Policy(ctx contractapi.TransactionContextInterface, id string, endorsers []string) error {
	endorsement_policy, err := statebased.NewStateEP(nil)
	if err != nil {
		return fmt.Errorf("<set_Endorsement_Policy> create new state endorsement policy failed: %v", err)
	}
	err = endorsement_policy.AddOrgs(statebased.RoleTypePeer, endorsers...)
	if err != nil {
		return fmt.Errorf("<set_Endorsement_Policy> add orgs to endorsement policy failed: %v", err)
	}
	policy, err := endorsement_policy.Policy()
	if err != nil {
		return fmt.Errorf("<set_Endorsement_Policy> create policy from endorsement policy failed: %v", err)
	}
	err = ctx.GetStub().SetStateValidationParameter(id, policy)
	if err != nil {
		return fmt.Errorf("<set_Endorsement_Policy> set state validation parameter failed: %v", err)
	}
	return nil
}

// check if the submitter org has the specified manner of access control over the given key
func verify_Access_Control(ctx contractapi.TransactionContextInterface, key string, manner string) (bool, error) {
	// get acl id from key
	id := key + "_ACL"
	aclJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("<verify_Access_Control> get state acl failed: %v", err)
	}
	if aclJSON == nil {
		return false, fmt.Errorf("<verify_Access_Control> acl does not exist: %v", err)
	}
	var acl Access_Control_List
	err = json.Unmarshal(aclJSON, &acl)
	if err != nil {
		return false, fmt.Errorf("<verify_Access_Control> unmarshal acl failed: %v", err)
	}
	// get submitter organization
	OrgMSP, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return false, fmt.Errorf("<verify_Access_Control> get client mspid failed: %v", err)
	}
	hospital := "Hospital" + OrgMSP[3:len(OrgMSP)-3]
	h_hospital := get_Byte_Hash([]byte(hospital))
	// get submitter attributes
	attr, exists, err := cid.GetAttributeValue(ctx.GetStub(), "ClientID")
	if err != nil {
		return false, fmt.Errorf("<verify_Access_Control> get attribute value failed: %v", err)
	}
	if !exists { // if the user is an admin, then either the hospital hash must match, or the access control must be available
		if string(h_hospital[:]) == string(acl.H_Hospital[:]) {
			return true, nil
		} else {
			read_access := find_List(acl.Read_Access_List, hospital)
			write_access := find_List(acl.Write_Access_List, hospital)
			if manner == "r" {
				return read_access, nil
			} else if manner == "w" {
				return write_access, nil
			} else if manner == "rw" {
				return read_access && write_access, nil
			}
			return false, fmt.Errorf("<verify_Access_Control> invalid manner of access control %v is none of r/w/rw", manner)
		}
	} else {
		attrs := strings.Split(attr, "_")
		if attrs[0] == "patient" { // if the user is a patient, then both the hospital and patient hashes must match
			h_patient := get_Byte_Hash([]byte(attrs[1]))
			if string(h_hospital[:]) == string(acl.H_Hospital) && string(h_patient[:]) == string(acl.H_Patient) {
				return true, nil
			}
			return false, nil
		}
	}
	return false, fmt.Errorf("<verify_Access_Control> unrecognized submitter has invalid format of ClientID")
}

export async function Construct_ACL(contract , params){
    const args = {
        patient: params["patient"],
        test: params["test"]
    }
    const transientData = {
        key: Buffer.from(JSON.stringify(args))
    }

    var tx = await contract.createTransaction("Consruct_ACL")
    tx.setEndorsingOrganizations(params["source_org"]+"MSP")
    tx.setTransient(transientData)
    var result = await tx.submit()
    console.log(result.toString())
}

export async function Destruct_ACL(contract , params){
    const args = {
        patient: params["patient"],
        test: params["test"]
    }
    const transientData = {
        key: Buffer.from(JSON.stringify(args))
    }

    var tx = await contract.createTransaction("Destruct_ACL")
    tx.setEndorsingOrganizations(params["source_org"]+"MSP")
    tx.setTransient(transientData)
    var result = await tx.submit()
    console.log(result.toString())
}

export async function Grant_Access_Control(contract){
    const args = {
        patient: params["patient"],
        test: params["test"],
        hospital: params["other"],
        manner: params["manner"]
    }
    const transientData = {
        access: Buffer.from(JSON.stringify(args))
    }

    var tx = await contract.createTransaction("Grant_Access_Control")
    tx.setEndorsingOrganizations(params["source_org"]+"MSP")
    tx.setTransient(transientData)
    var result = await tx.submit()
    console.log(result.toString())
}

export async function Revoke_Access_Control(contract , params){
    const args = {
        patient: params["patient"],
        test: params["test"],
        hospital: params["other"],
        manner: params["manner"]
    }
    const transientData = {
        access: Buffer.from(JSON.stringify(args))
    }

    var tx = await contract.createTransaction("Revoke_Access_Control")
    tx.setEndorsingOrganizations(params["source_org"]+"MSP")
    tx.setTransient(transientData)
    var result = await tx.submit()
    console.log(result.toString())
}

export async function Read_Private_Data(contract , params){
    const args = {
        hospital: params["other"],
        patient: params["patient"],
        test: params["test"]
    }
    const transientData = {
        info: Buffer.from(JSON.stringify(args))
    }
    let response = {
        error: ""
    }
    try{
        var tx = await contract.createTransaction("Read_Private_Data")
        tx.setEndorsingOrganizations(params["destination_org"]+"MSP")
        tx.setTransient(transientData)
        var result = await tx.submit()
        result = JSON.parse(result.toString())
        response["Hospital"] = result["Hospital"]
        response["Patient"] = result["Patient"]
        response["Test"] = result["Test"]
        response["Result"] = result["Result"]
        response["Allergies"] = result["Allergies"]
        response["Blood"] = result["Blood"]
    }
    catch(error){
        response["error"] = error.message
        console.log(error)
    }
    return response
}

export async function Write_Private_Data(contract , params){
    const args = {
        hospital: params["other"],
        patient: params["patient"],
        test: params["test"],
        result: params["result"],
        allergies: params["allergies"],
        blood: params["blood"]
    }
    const transientData = {
        info: Buffer.from(JSON.stringify(args))
    }
    let response = {
        error: ""
    }
    try{
        var tx = contract.createTransaction("Write_Private_Data")
        tx.setEndorsingOrganizations(params["destination_org"]+"MSP")
        tx.setTransient(transientData)
        var result = await tx.submit()
    }
    catch(error){
        response["error"] = error.message
        console.log(error)
    }
    return response
}

export async function Destroy_Private_Data(contract , params){
    const args = {
        patient: params["patient"],
        test: params["test"]
    }
    const transientData = {
        key: Buffer.from(JSON.stringify(args))
    }
    let response = {
        error: ""
    }
    try{
        var tx = contract.createTransaction("Destroy_Private_Data")
        tx.setEndorsingOrganizations(params["source_org"]+"MSP")
        tx.setTransient(transientData)
        var result = await tx.submit()
    }
    catch(error){
        response["error"] = error.message
        console.log(error)
    }
    return response
}

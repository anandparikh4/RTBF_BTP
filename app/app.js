// import requirements
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"

// import local dependencies
import { Construct_ACL , Destruct_ACL , Grant_Access_Control , Revoke_Access_Control} from "./access.js"
import { Read_Private_Data , Write_Private_Data , Destroy_Private_Data } from "./data.js"

// setup basics
const app = express()
app.use(cors());
app.use(bodyParser.json())

// serve at port indicated in command line
const PORT = process.argv[2]
app.listen(PORT, console.log(`Server started on port ${PORT}`))

// initialize the parameters
function init(params){
    if(params.hasOwnProperty("hospital")){
        params["source_org"] = params["hospital"].replace("Hospital" , "Org")
    }
    if(params.hasOwnProperty("other")){
        params["destination_org"] = params["other"].replace("Hospital" , "Org")
    }
    console.log(params)
    return params
}

// // The app only supports a POST requst to its home (default) URL
// app.post("/", async function (req,res){
//     // setup params
//     let params = init(req.body)
//     let response = {
//         message: "Backend Connected Successfully"
//     }
//     res.send(JSON.stringify(response))
// })

let isLoggedIn = false
let gateway = null
let network = false
let contract = false

async function Login(){
    isLoggedIn = true
    // do initgateway and other network / contract things
    let response = {
        message: "Successfully logged in"
    }
    return response
}

app.post("/", async function (req,res){
    // setup params
    let params = init(req.body)
    let response = {    // default response
        message: "invalid request ignored"
    }

    // first login
    if(!isLoggedIn){
        if(params["method"] == "Login") response = await Login()
        // else ignore the request
    }
    else{
        switch(params["method"]){
            case "Login":
                response = await Login()
                break
            case "Construct":
                response = await Construct_ACL(contract , params)
                break
            case "Destruct":
                response = await Destruct_ACL(contract , params)
                break
            case "Grant":
                response = await Grant_Access_Control(contract , params)
                break
            case "Revoke":
                response = await Revoke_Access_Control(contract , params)
                break
            case "Read":
                response = await Read_Private_Data(contract , params)
                break
            case "Write":
                response = await Write_Private_Data(contract , params)
                break
            case "Purge":
                response = await Destroy_Private_Data(contract , params)
                break
            default:
                // do nothing (this involves re-logins)
        }
    }
    
    res.send(JSON.stringify(response))
})

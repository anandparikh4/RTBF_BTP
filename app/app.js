// import requirements
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

// setup basics
const app = express()
app.use(cors());
app.use(bodyParser.json())

// serve at port indicated in command line
const PORT = process.argv[2]
app.listen(PORT, console.log(`Server started on port ${PORT}`))

// The app only supports a POST requst to its home (default) URL
app.post("/", (req,res) => {
    console.log(req.body["message"])
    const obj = {
        message: "Backend Connected"
    }
    res.send(JSON.stringify(obj))
})

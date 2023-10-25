const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express()
app.use(cors());
app.use(bodyParser.json())

app.post("/", (req,res) => {
    console.log(req.body["message"])
    const obj = {
        message: "Backend Connected"
    }
    res.send(JSON.stringify(obj))
})

const PORT = process.argv[2]

app.listen(PORT, console.log(`Server started on port ${PORT}`))

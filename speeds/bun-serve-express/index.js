const express = require("bun-serve-express").default;
const app = express()

let i = 0;

app.get("/", (req, res)=>{
    res.send(`Request ${i++}`)
})

app.listen(3000, ()=>{
    console.log("Running")
})
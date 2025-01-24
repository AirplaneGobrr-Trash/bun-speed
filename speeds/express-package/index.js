const express = require("express");
const app = express()

let i = 0;

app.get("/", (req, res)=>{
    res.send(`Request ${i++}`)
})

app.listen(3000, ()=>{
    console.log("Running")
})
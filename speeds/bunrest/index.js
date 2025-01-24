const bunrest = require("bunrest").default
const app = bunrest()

let i = 0;

app.get("/", (req, res)=>{
    res.send(`Request ${i++}`)
})
app.listen(3000, ()=>{
    console.log("Running")
})
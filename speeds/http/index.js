const http = require("http")

let i = 0;

http.createServer((req, res)=>{
    res.write(`Count: ${i++}`)
    res.end()
}).listen(3000)
console.log("running")
const bun = require("bun")

let i = 0;

bun.serve({
    fetch(req){
        return new Response(`Count: ${i++}`)
    },

})
console.log("running")
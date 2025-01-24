const childProcess = require('child_process');
const util = require('util');
const path = require('path');
const bun = require("bun");
const fs = require("fs");

const exec = util.promisify(childProcess.exec)

const delay = (ms) => new Promise(g => setTimeout(g, ms))

// oha http://localhost:3000 -n 500000 -H "Accept-Encoding: identity"

let modules = fs.readdirSync("speeds");
let tests = {};

async function run() {
    for (let mod of modules) {
        tests[mod] = {};
        let modPath = path.join(__dirname, "speeds", mod);

        try {
            let programs = require(`./speeds/${mod}/platform.json`);
            console.log(`Loaded programs for ${mod}:`, programs);

            for (let program of programs) {
                console.log(`${mod} running with ${program}`);
                const proc = childProcess.spawn(program, ["."], { cwd: modPath });

                await new Promise(g=>proc.stdout.once("data",g));
                console.log(`${mod} with ${program} is running`);

                try {
                    let out = await exec(`oha http://localhost:3000 -n 100000 -H "Accept-Encoding: identity" -j`);
                    tests[mod][program] = JSON.parse(out.stdout);
                } catch (error) {
                    console.error(`Error running 'oha' for ${mod} with ${program}:`, error);
                } finally {
                    proc.kill(); // Terminate the process
                    await new Promise(g=>proc.once("exit",g))
                    console.log(`${mod} ${program} killed`);
                    await delay(100); // Ensure port is released
                }
            }
        } catch (error) {
            console.error(`Error handling ${mod}:`, error);
            continue;
        }

        console.log(`Done with ${mod}`);
    }

    console.log("Full done!");
    console.log(tests);
}

run();


bun.serve({
    fetch(req) {
        let url = new URL(req.url)
        console.log(url)
        if (url.pathname == "/") return new Response(bun.file("index.html"));
        if (url.pathname == "/data") return Response.json(tests);
    },
    port: 3100
})
import { createServer } from 'node:http'
import { exec } from 'child_process';

const PORT = process.env.PORT;
const SECRET = process.env.SECRET;

async function handler (request, response) {
    const { headers, method, url } = request;
    let body = [];

    request.on('error', (error) => {
        console.error({ at: Date.now(), headers, method, url, error });
    })
    
    request.on('data', (chunk) => {
        body.push(chunk);
    });
    
    request.on('end', () => {
        body = Buffer.concat(body).toString();
        console.error({ at: Date.now(), headers, method, url, body });
        
        response.writeHead(200);
        response.end("Heard that!");

        try {
            body = JSON.parse(body)
            
            // if(body.hook.config.secret !== SECRET) {
            //     throw new Error(`The secret sent is incorrect...`)
            // }

            if(body.repository.name === 'segundo-subsuelo') {
                exec('bash ~/scripts/build-segundo-subsuelo.sh', (error, stdout, stderr) => {
                    console.log(stdout);
                    console.log(stderr);
                    if (error !== null) {
                        console.log(`exec error: ${error}`);
                    }
                })
            }
            
        } catch (error) {
            console.error(error)
        }
    });
}

const server = createServer(handler)
server.listen(PORT)
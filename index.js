import { createServer } from 'node:http'

const PORT = process.env.PORT;

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
    });
}

const server = createServer(handler)
server.listen(PORT)
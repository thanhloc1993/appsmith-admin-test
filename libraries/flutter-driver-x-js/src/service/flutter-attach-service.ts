import * as child_process from 'child_process';
import * as http from 'http';

const requestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', function (chunk) {
            body += chunk;
        });
        req.on('end', async function () {
            try {
                const data = JSON.parse(body);
                console.log(data, data);
                switch (req.url) {
                    case '/attach': {
                        const udid = data.udid;
                        const path = data.path;
                        const result = await createFlutterAttachProcess(udid, path);
                        console.log(result);

                        res.writeHead(200);
                        res.end(
                            JSON.stringify({
                                httpDebuggerServiceUrl: result.httpDebuggerServiceUrl,
                            })
                        );
                        break;
                    }
                }
            } catch (error) {
                res.end(JSON.stringify({ error: JSON.stringify(error) }));
            }
        });
    }
};

const server = http.createServer(requestListener);
const port = 4600;
server.listen(port);
console.log(`Server started at :${port}`);

function createFlutterAttachProcess(
    udid: string,
    path: string
): Promise<{
    flutterAttachProcess: child_process.ChildProcessWithoutNullStreams;
    httpDebuggerServiceUrl: string;
}> {
    return new Promise<{
        flutterAttachProcess: child_process.ChildProcessWithoutNullStreams;
        httpDebuggerServiceUrl: string;
    }>((resolve, reject) => {
        console.log(udid);
        console.log(path);
        const process = child_process.spawn(
            'flutter',
            ['attach', '-d', udid, '-t', `${path}/lib/main.dart`],
            {
                cwd: path,
            }
        );
        process.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            const message = `${data}`;
            if (message.includes('An Observatory debugger and profiler')) {
                while (!process.killed) {
                    process.kill();
                }

                const lineMatch = message.match(/An Observatory debugger and profiler.+/);
                if (lineMatch) {
                    const match = lineMatch[0].match(/http.+\//);
                    console.log(message);
                    if (match) {
                        resolve({
                            flutterAttachProcess: process,
                            httpDebuggerServiceUrl: match[0],
                        });
                    } else {
                        reject(`Don't match message`);
                    }
                } else {
                    reject(`Don't match message`);
                }
            }
        });

        process.stderr.on('data', (data) => {
            reject(data);
        });

        process.on('error', (error) => {
            reject(error);
        });

        process.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    });
}

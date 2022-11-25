import { Command } from '../common/message';
import { FlutterDriver, WebDriver } from './driver';
import { Client } from 'rpc-websockets';
import { Browser } from 'webdriverio';

export class VMServiceFlutterDriver extends FlutterDriver {
    socketClient?: SocketClient | undefined;
    appiumClientDriver?: Browser<'async'> | undefined;
    webDriver?: WebDriver | undefined;

    static async connect(url: string): Promise<FlutterDriver> {
        const socketClient = new SocketClient(url);
        await socketClient.waitForOpenConnection();
        return new VMServiceFlutterDriver(socketClient);
    }

    constructor(socketClient: SocketClient) {
        super();
        this.socketClient = socketClient;
    }

    async close(): Promise<void> {
        this.socketClient?.close();
    }
    async sendCommand(command: Command): Promise<any> {
        return this.socketClient?.sendCommand(command);
    }
    restart(): Promise<void> {
        return this.restart();
    }
    reload(): Promise<void> {
        throw new Error("VMService doesn't support");
    }

    async screenshot(): Promise<string> {
        return this.socketClient?.dwdsScreenshot();
    }
    isApp(): boolean {
        return true;
    }
    setOffline(_: boolean): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

export class SocketClient extends Client {
    isolateId = '';

    load() {
        this.on('open', async () => {
            const response: any = await this.call('getVM', {});
            const mainIsolate = response.isolates.find(
                (element: any) => element.name === 'main' || element.name === `main()`
            );
            this.isolateId = mainIsolate.id;
            console.log('mainIsolate', mainIsolate);
        });
    }

    waitForOpenConnection(): Promise<void> {
        this.load();
        return new Promise<void>((resolve, reject) => {
            const maxRetry = 60;
            const intervalTime = 1000;

            let currentRetry = 0;
            const interval = setInterval(() => {
                if (currentRetry == maxRetry) {
                    clearInterval(interval);
                    reject(new Error('Timeout connect'));
                } else if (this.isolateId !== '') {
                    clearInterval(interval);
                    console.log('waitForOpenConnection', 'connected');
                    resolve();
                }
                console.log('waitForOpenConnection', 'connecting');
                currentRetry++;
            }, intervalTime);
        });
    }

    async sendCommand(command: Command) {
        console.log('>>>>');
        const temp = JSON.parse(
            JSON.stringify({
                ...command,
                isolateId: this.isolateId,
            })
        );
        console.log(temp);
        const response = await this.call(`ext.flutter.driver`, temp);
        console.log('<<<<');
        console.log(response);
        return response;
    }

    async dartVMScreenshot() {
        const response = await this.call(`_flutter.screenshot`, {
            isolateId: this.isolateId,
        });
        return response;
    }

    async dwdsScreenshot(): Promise<any> {
        const response = await this.call(`ext.dwds.screenshot`, {
            isolateId: this.isolateId,
        });
        return response;
    }

    async restart() {
        let response;
        if (this.isApp()) {
            response = await this.call(`s0.hotRestart`, {
                isolateId: this.isolateId,
            });
        } else {
            response = await this.call(`hotRestart`, {
                isolateId: this.isolateId,
            });
        }
        console.log(response);
        return response;
    }

    isApp() {
        return this.isolateId.includes('isolates/');
    }
}

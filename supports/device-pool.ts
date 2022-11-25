class RemoteOptions {
    hostname: string;
    path = '/wd/hub';
    port: number;
    capabilities: Capabilities;
    isConnected = false;

    constructor(hostname: string, port: number, capabilities: Capabilities) {
        this.hostname = hostname;
        this.port = port;
        this.capabilities = capabilities;
    }
}

export interface Capabilities {
    platformName: string;
    platformVersion: string;
    app: string;
    automationName: string;
    deviceName: string;
    isHeadless: boolean;
    clearSystemFiles: boolean;
    newCommandTimeout: number;
}

class AndroidCapabilities implements Capabilities {
    platformName = 'Android';
    platformVersion: string;
    app: string;
    automationName = 'UiAutomator2';
    deviceName: string;
    isHeadless: boolean;
    clearSystemFiles = true;
    clearDeviceLogsOnStart = true;
    newCommandTimeout = 60 * 15;
    autoGrantPermissions = true;

    constructor(app: string, deviceName: string, platformVersion: string, isHeadless: boolean) {
        this.app = app;
        this.deviceName = deviceName;
        this.platformVersion = platformVersion;
        this.isHeadless = isHeadless;
    }
}

class IOSCapabilities implements Capabilities {
    platformName = 'iOS';
    platformVersion: string;
    app: string;
    automationName = 'XCUITest';
    deviceName: string;
    isHeadless: boolean;
    clearSystemFiles = true;
    newCommandTimeout = 60 * 15;
    autoAcceptAlerts = true;

    constructor(app: string, deviceName: string, platformVersion: string, isHeadless: boolean) {
        this.app = app;
        this.deviceName = deviceName;
        this.platformVersion = platformVersion;
        this.isHeadless = isHeadless;
    }
}

export abstract class DevicePool {
    private static hostname: string;
    private static isHeadless: boolean;

    static setOptions(hostname: string, isHeadless: boolean) {
        if (this.hostname) {
            throw 'Options were set';
        }
        if (!hostname || isHeadless == null) {
            throw 'Having an options is undefined';
        }
        this.hostname = hostname;
        this.isHeadless = isHeadless;
    }

    protected abstract initRemoteOptionsList(): Array<RemoteOptions>;

    protected remoteOptionsList: Array<RemoteOptions>;

    constructor() {
        this.remoteOptionsList = this.initRemoteOptionsList();
        this.remoteOptionsList.forEach((element) => {
            element.hostname = DevicePool.hostname;
            element.capabilities.isHeadless = DevicePool.isHeadless;
        });
    }

    get remoteOptions(): RemoteOptions | undefined {
        const remoteOptions = this.remoteOptionsList.find(
            (remoteOptions) => remoteOptions.isConnected === false
        );

        if (remoteOptions) {
            remoteOptions.isConnected = true;
        }
        return remoteOptions;
    }

    clearConnectedState(deviceName?: string) {
        const index = this.remoteOptionsList.findIndex(
            (remoteOptions) => remoteOptions.capabilities.deviceName === deviceName
        );
        if (index >= 0) {
            this.remoteOptionsList[index].isConnected = false;
        }
    }
}

export class AndroidDevicePool extends DevicePool {
    protected initRemoteOptionsList(): RemoteOptions[] {
        return [
            new RemoteOptions('', 4701, new AndroidCapabilities('', 'Android 11', '11.0', false)),
            new RemoteOptions('', 4702, new AndroidCapabilities('', 'Android 10', '10.0', false)),
            new RemoteOptions('', 4703, new AndroidCapabilities('', 'Android 9', '9.0', false)),
            new RemoteOptions('', 4704, new AndroidCapabilities('', 'Android 8', '8.0', false)),
        ];
    }

    private static instance: AndroidDevicePool;

    public static getInstance(): AndroidDevicePool {
        if (!AndroidDevicePool.instance) {
            AndroidDevicePool.instance = new AndroidDevicePool();
        }

        return AndroidDevicePool.instance;
    }

    private constructor() {
        super();
    }
}

export class IOSDevicePool extends DevicePool {
    protected initRemoteOptionsList(): RemoteOptions[] {
        return [
            new RemoteOptions('', 4801, new IOSCapabilities('', 'iPhone 11', '12.0', false)),
            new RemoteOptions('', 4802, new IOSCapabilities('', 'iPhone 11 Pro', '13.0', false)),
            new RemoteOptions('', 4803, new IOSCapabilities('', 'iPhone 12', '14.0', false)),
            new RemoteOptions('', 4804, new IOSCapabilities('', 'iPhone 12 Pro', '15.0', false)),
        ];
    }

    private static instance: IOSDevicePool;

    public static getInstance(): IOSDevicePool {
        if (!IOSDevicePool.instance) {
            IOSDevicePool.instance = new IOSDevicePool();
        }

        return IOSDevicePool.instance;
    }

    private constructor() {
        super();
    }
}
let hostname;
if (process.env.DOCKER === 'true') {
    hostname = 'host.docker.internal';
} else {
    hostname = '0.0.0.0';
}
DevicePool.setOptions(hostname, false);

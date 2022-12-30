import { Bucket, Storage, UploadOptions } from '@google-cloud/storage';

export default class GoogleCloudStorage {
    bucketName = process.env.BUCKET_NAME || 'eibanam-2';
    storage: Storage;
    bucket?: Bucket;
    projectId: string;
    constructor() {
        this.projectId = process.env.GOOGLE_PROJECT_ID!;
        if (!this.projectId) throw new Error('GOOGLE_PROJECT_ID is not defined');
        //using default credentials, need to set environment variables
        //GOOGLE_APPLICATION_CREDENTIALS=./application_default_credentials.json
        this.storage = new Storage({
            projectId: this.projectId,
        });
        void (async () => {
            await this.createBucket();
        })();
    }
    getPublicUrl = (path: string) => {
        return `https://storage.cloud.google.com/${this.bucketName}/${path}`;
    };

    async createBucket() {
        const [buckets] = await this.storage.getBuckets({
            project: this.projectId,
            prefix: this.bucketName,
        });

        buckets.forEach((bucket) => {
            if (bucket.name === this.bucketName) {
                this.bucket = bucket;
                return;
            }
        });
        // Creates the new bucket
        if (!this.bucket) {
            this.bucket = await this.storage.bucket(this.bucketName);
            await this.bucket.create().catch((err) => console.error('[createBucket]', err));
            await this.bucket.makePrivate({
                force: true,
            });
        }

        console.log(`Bucket ${this.bucketName} created.`);
    }
    uploadFile = async ({
        fileName,
        base64EncodedImageString,
        options,
        folder = 'general/',
    }: {
        fileName: string;
        folder: string;
        base64EncodedImageString: string;
        options?: UploadOptions;
    }) => {
        if (!this.bucket) await this.createBucket();
        const bucket = this.bucket!;

        const imageBuffer = Buffer.from(base64EncodedImageString, 'base64');
        const path = folder + fileName;

        options = {
            ...options,
            public: false,
            timeout: 30000,
        };
        const file = await bucket.file(path, options);

        await file.save(imageBuffer, options).catch((err) => console.error('[save]', err));

        return this.getPublicUrl(path);
    };
}

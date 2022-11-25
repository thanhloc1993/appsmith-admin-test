import { IWorldOptions } from '@cucumber/cucumber';

import AbstractDriver from '@drivers/abstract-driver';

import { ConnectOptions, DriverOptions, TeacherInterface } from './app-types';
import { CourseListEntity } from './entities/course-list-entity';
import { UserProfileEntity } from './entities/user-profile-entity';
import { ByValueKey, RequestDataResult, FlutterDriverFactory } from 'flutter-driver-x';
import { TeacherKeys } from 'step-definitions/teacher-keys/teacher-keys';

export class Teacher extends AbstractDriver implements TeacherInterface {
    driverName = '';

    /**
     * constructor
     * @param options
     * @param driverOptions
     */
    constructor(options: IWorldOptions, driverOptions: DriverOptions) {
        super(options, driverOptions);
        this.driverName = driverOptions.driverName;
    }

    /**
     * @param options
     * @returns {Promise<void>}: connect
     */
    connect = async (options: ConnectOptions): Promise<void> => {
        // const homedir = os.homedir();
        // const filePath = homedir + '/vmservices/' + this.flutterDriverName;
        this.browser = options.browser;
        const origin = process.env.TEACHER_HOST || 'http://localhost:3002';

        await this.connectPlaywrightDriver({
            origin: origin,
            timeout: 900 * 1000,
            browser: this.browser,
        });

        this.flutterDriver = await FlutterDriverFactory.connectWeb(origin, this.page!, 900 * 1000);
    };
    /**
     *
     * @param description
     * @param fn
     * @param bufferScreenshot
     * @returns {Promise<void>}: instruction
     */
    instruction = async (
        description: string,
        fn: (learner: TeacherInterface) => Promise<void>,
        bufferScreenshot?: Buffer | string
    ): Promise<void> => {
        return await this.instructionDriver<TeacherInterface>(description, fn, bufferScreenshot);
    };

    /**
     * @returns {Promise<void>}: quit
     */
    quit = async () => {
        await this.flutterDriver?.close();
        await this.quitPlaywrightDriver();
    };

    /**
     * @returns {Promise<string>}: get token
     */
    getToken = async (): Promise<string> => {
        const data = (await this.flutterDriver?.requestData('GET_TOKEN')) as RequestDataResult;
        return data.response.message;
    };

    /**
     *
     * @returns {Promise<string>} get avatar url
     */
    getAvatarUrl = async () => {
        const data = (await this.flutterDriver?.requestData('GET_AVATAR_URL')) as RequestDataResult;
        return data.response.message;
    };

    /**
     *
     * @returns {Promise<string>} get user id
     */
    getUserId = async () => {
        const data = (await this.flutterDriver?.requestData('GET_USER_ID')) as RequestDataResult;
        return data.response.message;
    };

    /**
     *
     * @returns {Promise<string>} get profile
     */
    getProfile = async (): Promise<UserProfileEntity> => {
        const data = (await this.flutterDriver?.requestData('GET_PROFILE')) as RequestDataResult;

        return JSON.parse(data.response.message) as UserProfileEntity;
    };

    /**
     *
     * @returns {Promise<void>} refresh course list
     */
    refreshCourseList = async (): Promise<void> => {
        (await this.flutterDriver?.requestData('REFRESH_COURSE_LIST')) as RequestDataResult;
    };

    /**
     *
     * @returns {Promise<CourseListEntity>} get course list
     */
    getCourseList = async (): Promise<CourseListEntity> => {
        const data = (await this.flutterDriver?.requestData(
            'GET_COURSE_LIST'
        )) as RequestDataResult;

        return JSON.parse(data.response.message) as CourseListEntity;
    };

    /**
     *
     * @returns {Promise<void>} logout
     */
    logout = async (): Promise<void> => {
        const teacherDriver = this.flutterDriver!;

        const appBarProfileFinder = new ByValueKey(TeacherKeys.userProfileButton);
        await teacherDriver.tap(appBarProfileFinder);

        await teacherDriver.tap(new ByValueKey(TeacherKeys.logoutButton));

        await teacherDriver.tap(new ByValueKey(TeacherKeys.signOutDialogButton));
    };

    /**
     * @param fileType as fileType of [image, video, pdf]
     * @returns {Promise<void>} prepare upload attachment type
     */
    prepareUploadAttachmentType = async (fileType: string): Promise<void> => {
        const data = {
            event: 'PREPARE_UPLOAD_ATTACHMENT_TYPE',
            fileType: fileType,
        };
        await this.flutterDriver?.requestData(JSON.stringify(data).replace(/"/g, '\\"'));
    };

    /**
     *
     * @returns {Promise<void>} sendZipFile
     */
    sendZipFile = async (): Promise<void> => {
        await this.flutterDriver?.requestData('SEND_ZIP_FILE');
    };
}

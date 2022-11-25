import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { IWorldOptions } from '@cucumber/cucumber';

import AbstractDriver from '@drivers/abstract-driver';

import { ConnectOptions, DriverOptions, LearnerInterface } from './app-types';
import { DevicePool, AndroidDevicePool, IOSDevicePool } from './device-pool';
import { CourseListEntity } from './entities/course-list-entity';
import { EntryExitListEntity } from './entities/entry-exit-list-entity';
import { KidsOfParentEntity } from './entities/kid-of-parents-entity';
import { UserProfileEntity } from './entities/user-profile-entity';
import { FlutterDriverFactory, delay, ByValueKey, RequestDataResult } from 'flutter-driver-x';
import { LearnerKeys } from 'step-definitions/learner-keys/learner-key';

export class Learner extends AbstractDriver implements LearnerInterface {
    deviceName?: string;
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
        this.browser = options.browser;
        switch (process.env.PLATFORM) {
            case 'WEB': {
                const origin = process.env.LEARNER_HOST || 'http://localhost:3003';
                await this.connectPlaywrightDriver({
                    origin: origin,
                    timeout: 900 * 1000,
                    browser: this.browser,
                });

                this.flutterDriver = await FlutterDriverFactory.connectWeb(
                    origin,
                    this.page!,
                    900 * 1000
                );
                break;
            }

            case 'ANDROID':
            case 'IOS': {
                let app;
                let devicePool: DevicePool;
                const hostProjectPath = process.env.HOST_PROJECT_PATH;
                const isAndroid = process.env.PLATFORM === 'ANDROID';
                if (isAndroid) {
                    devicePool = AndroidDevicePool.getInstance();
                } else {
                    devicePool = IOSDevicePool.getInstance();
                }

                let remoteOptions;
                while (!remoteOptions) {
                    remoteOptions = devicePool.remoteOptions;
                    if (!remoteOptions) {
                        await delay(5000);
                    }
                }

                this.deviceName = remoteOptions.capabilities.deviceName;
                if (isAndroid) {
                    app = hostProjectPath + '/learner.apk';
                } else {
                    app = hostProjectPath + '/learner.app';
                }
                remoteOptions.capabilities.app = app;

                if (this.deviceName) {
                    if (isAndroid) {
                        const hostApplicationProjectPath =
                            hostProjectPath + '/packages/student-app/manabie_learner';
                        if (hostApplicationProjectPath) {
                            // this.flutterDriver = await FlutterDriverFactory.connectAndroid(
                            //     remoteOptions,
                            //     hostApplicationProjectPath
                            // );
                        } else {
                            throw 'hostApplicationProjectPath is undefined';
                        }
                    } else {
                        // this.flutterDriver = await FlutterDriverFactory.connectIOS(remoteOptions);
                    }
                } else {
                    throw 'deviceName is undefined';
                }
                break;
            }

            default: {
                throw "Don't match any platform, please set 'PLATFORM' environment variable: WEB, IOS or WEB";
            }
        }
    };

    /**
     * @returns {Promise<void>}: quit
     */
    quit = async () => {
        await this.flutterDriver?.close();
        await this.quitPlaywrightDriver();
        if (process.env.PLATFORM === 'ANDROID') {
            AndroidDevicePool.getInstance().clearConnectedState(this.deviceName);
        }
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
     * @param description
     * @param fn
     * @returns {Promise<void>}: instruction
     */
    instruction = async (
        description: string,
        fn: (learner: LearnerInterface) => Promise<void>
    ): Promise<void> => {
        return await this.instructionDriver<LearnerInterface>(description, fn);
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
     * @returns {Promise<KidsOfParentEntity>} {
     *   "$":"KidsOfParentModel",
     *   "kidsOfParent":[
     *      {
     *         "$":"Learner",
     *         "id":"",
     *         "createdAt":,
     *         "appleUserId":"",
     *         "facebookId":"",
     *         "name":"",
     *         "avatar":"",
     *         "userGroupEnum":"student"
     *      }
     *   ]
     *}
     */
    getKidsOfParent = async (): Promise<KidsOfParentEntity> => {
        const data = (await this.flutterDriver?.requestData(
            'GET_KIDS_OF_PARENT'
        )) as RequestDataResult;

        return JSON.parse(data.response.message) as KidsOfParentEntity;
    };

    /**
     *
     * @returns {Promise<void>} open drawer in home screen
     */
    openHomeDrawer = async () => {
        const learner = this.flutterDriver!;

        await this.instruction(`Open drawer`, async function () {
            const homeScreenDrawerButtonFinder = new ByValueKey(LearnerKeys.homeScreenDrawerButton);
            await learner.waitFor(homeScreenDrawerButtonFinder);
            await learner.tap(homeScreenDrawerButtonFinder);
        });
    };

    /**
     *
     * @param tabButtonKey
     * @param tabPageKey
     * @returns {Promise<void>} click on tab
     */
    clickOnTab = async (tabButtonKey: string, tabPageKey: string): Promise<void> => {
        const learner = this.flutterDriver!;
        await learner.waitFor(new ByValueKey(tabButtonKey), 10000);
        await learner.tap(new ByValueKey(tabButtonKey));

        const pageFinder = new ByValueKey(tabPageKey);
        await learner.runUnsynchronized(async () => {
            await learner.waitFor(pageFinder, 10000);
        });
    };

    /**
     *
     * @returns {Promise<void>} logout
     */
    logout = async (): Promise<void> => {
        const learnerDriver = this.flutterDriver!;

        await learnerDriver.waitFor(new ByValueKey(LearnerKeys.homeScreen));

        if (learnerDriver.isApp()) {
            await this.openHomeDrawer();
        } else {
            const appBarProfileFinder = new ByValueKey(LearnerKeys.app_bar_profile);
            await learnerDriver.tap(appBarProfileFinder);
        }

        await learnerDriver.tap(new ByValueKey(LearnerKeys.logoutButton));

        await learnerDriver.tap(new ByValueKey(LearnerKeys.confirmedLogoutDialog));

        await learnerDriver.tap(new ByValueKey(LearnerKeys.confirmedLogoutDialogYesButton));
    };

    /**
     *
     * @param username
     * @returns {Promise<void>} check username
     */
    checkUserName = async (username: string): Promise<void> => {
        const learnerDriver = this.flutterDriver!;
        if (learnerDriver.isApp()) {
            /// TODO: Implement for App UX, need to update keys on Mobile app first
        } else {
            const appBarNameFinder = new ByValueKey(LearnerKeys.appBarName(username));
            await learnerDriver.waitFor(appBarNameFinder);
        }
    };

    /**
     *
     * @param avatarUrl
     * @returns {Promise<void>} check avatar url in Home Screen
     */
    verifyAvatarInHomeScreen = async (avatarUrl: string): Promise<void> => {
        const learnerDriver = this.flutterDriver!;
        if (learnerDriver.isApp()) {
            await this.openHomeDrawer();

            const avatarFinder = new ByValueKey(LearnerKeys.avatarWidgetInHomeDrawer(avatarUrl));
            await this.instruction(`Check avatar in the drawer`, async function () {
                await learnerDriver.waitFor(avatarFinder);
                await learnerDriver.tap(new ByValueKey(LearnerKeys.back_button));
            });

            await learnerDriver.tap(avatarFinder);
            await learnerDriver.tap(new ByValueKey(LearnerKeys.back_button));
        } else {
            await this.instruction(`Verify new avatar in the web popup menu`, async function () {
                const avatarFinder = new ByValueKey(LearnerKeys.avatarWidget(avatarUrl));
                await learnerDriver.waitFor(avatarFinder);
            });
        }
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
     * @returns {Promise<string[]>} get quiz name list
     */
    getQuizNameList = async (): Promise<string[]> => {
        await this.flutterDriver!.waitFor(new ByValueKey(SyllabusLearnerKeys.quiz), 30000);
        const data = (await this.flutterDriver?.requestData(
            'GET_QUIZ_NAME_LIST'
        )) as RequestDataResult;

        return JSON.parse(data.response.message) as string[];
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
     * @returns {Promise<void>}: killing app on Web by go back home screen and refresh
     */
    killAppOnWeb = async (): Promise<void> => {
        const currentURL = this.flutterDriver!.webDriver?.page.url() || '';
        if (currentURL == '') {
            throw 'Current URL must not empty';
        }
        const domainURL = currentURL.split('#');
        await this.flutterDriver!.webDriver?.page.goto(`${domainURL[0]}#/`);
        await this.flutterDriver!.waitFor(new ByValueKey(LearnerKeys.homeScreen), 20000);
        await this.flutterDriver!.reload();
    };

    /**
     *
     * @returns {Promise<EntryExitListEntity>} get student entry exit records
     */
    getEntryExitRecords = async (): Promise<EntryExitListEntity> => {
        const data = (await this.flutterDriver?.requestData(
            'GET_ENTRY_EXIT_RECORDS'
        )) as RequestDataResult;

        return JSON.parse(data.response.message) as EntryExitListEntity;
    };

    /**
     *
     * @returns {Promise<void>} sendZipFile
     */
    sendZipFile = async (): Promise<void> => {
        await this.flutterDriver?.requestData('SEND_ZIP_FILE');
    };
}

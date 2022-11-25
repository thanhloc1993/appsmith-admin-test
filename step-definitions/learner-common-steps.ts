import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { aliasRandomContentBookB1, aliasRandomContentBookB3 } from './alias-keys/syllabus';
import { getProfileAliasToLoginsLearnerApp } from './credential-account-definitions';
import { loginOnLearnerApp } from './learner-email-login-definitions';
import { LearnerKeys } from './learner-keys/learner-key';
import { ContentBookProps } from './types/content';
import { randomString } from './utils';
import { ByValueKey } from 'flutter-driver-x';
import {
    studentGoesToPageFromHomeScreen,
    studentNotSeeAllChaptersInCourse,
    studentNotSeeAllTopicsInCourse,
    studentNotSeeSelectedBookNameInCourseDetail,
    studentSeeAllChaptersInCourse,
    studentSeeAllTopicsInCourse,
    studentSeeSelectedBookNameInCourseDetail,
} from 'test-suites/squads/syllabus/step-definitions/syllabus-utils';

Given('student is on {string}', async function (this: IMasterWorld, screenKey: string) {
    const learner = this.learner;
    await learner.instruction(`Student is on ${screenKey}`, async function () {
        await learner.flutterDriver!.waitFor(new ByValueKey(screenKey));
    });
});

Given(
    'student goes to {string} on Home Screen',
    async function (this: IMasterWorld, screenKey: string) {
        const learner = this.learner;

        let tabKey;
        switch (screenKey) {
            case LearnerKeys.learning_page:
                tabKey = LearnerKeys.learning_tab;
                break;
            case LearnerKeys.todos_page:
                tabKey = LearnerKeys.todos_tab;
                break;
            case LearnerKeys.messages_page:
                tabKey = LearnerKeys.messages_tab;
                break;
            case LearnerKeys.lesson_page:
                tabKey = LearnerKeys.lesson_tab;
                break;
            case LearnerKeys.stats_page:
                tabKey = LearnerKeys.stats_tab;
                break;
            default:
                throw `Not implement ${screenKey}`;
        }
        await studentGoesToPageFromHomeScreen(learner, tabKey, screenKey);
    }
);

When('student refreshes their browser', async function (this: IMasterWorld) {
    const learner = this.learner;
    await learner.instruction(`student refreshes their browser`, async function () {
        await learner.flutterDriver!.reload();
    });
});

When(
    'student enters {string} on browser address',
    async function (this: IMasterWorld, path: string) {
        const learner = this.learner;
        const domainUrl = learner.page!.url().split('#')[0] + '#/';

        await learner.instruction(
            `student enters ${domainUrl}${path} on browser address`,
            async function () {
                await learner.page!.goto(`${domainUrl}${path}`);
            }
        );
    }
);

When('student clear url back to Home Screen and reloads web', async function (this: IMasterWorld) {
    const learner = this.learner;
    const learnerProfile = getProfileAliasToLoginsLearnerApp(this, 'student');
    await learner.instruction('Student back to home screen and reloads web', async function () {
        await learner.killAppOnWeb();
        try {
            await learner.flutterDriver!.waitFor(new ByValueKey(LearnerKeys.homeScreen), 20000);
        } catch {
            //Web log out student, need to login again
            await loginOnLearnerApp({
                learner,
                email: learnerProfile!.email,
                name: learnerProfile!.name,
                password: learnerProfile!.password,
            });
        }
    });
});

When(
    'student enters {string} with random string on browser address',
    async function (this: IMasterWorld, path: string) {
        const learner = this.learner;
        const domainUrl = learner.page!.url().split('#')[0] + '#/';
        const randomText = randomString(5);
        await learner.instruction(
            `student enters ${domainUrl}${path}${randomText} on browser address`,
            async function () {
                await learner.page!.goto(`${domainUrl}${path}${randomText}`);
            }
        );
    }
);

When('student taps back on browser tab bar', async function (this: IMasterWorld) {
    const learner = this.learner;

    await learner.instruction(`student taps back button`, async function () {
        await learner.page!.goBack();
    });
});

Then('student is still on {string}', async function (this: IMasterWorld, screenKey: string) {
    const learner = this.learner;
    await learner.instruction(`Student is on ${screenKey}`, async function () {
        await learner.flutterDriver!.waitFor(new ByValueKey(screenKey));
    });
});

Then(
    'student sees books, chapters, topics of book {string} in Book Detail Screen',
    async function (this: IMasterWorld, book: string) {
        const learner = this.learner;
        const context = this.scenario;

        let bookContent: ContentBookProps;
        switch (book) {
            case 'B1':
                bookContent = context.get<ContentBookProps>(aliasRandomContentBookB1);
                break;
            case 'B3':
                bookContent = context.get<ContentBookProps>(aliasRandomContentBookB3);
                break;
            default:
                throw 'Not implement';
        }

        const chapterNames = bookContent.chapterList.map((chapter) => chapter.info!.name);
        const topicNames = bookContent.topicList.map((topic) => topic.name);
        const bookName = bookContent.book.name;
        await learner.instruction(`Student see book ${bookName} is displayed`, async function () {
            await studentSeeSelectedBookNameInCourseDetail(learner, bookName);
        });

        await learner.instruction(
            `Student see chapter list of ${bookName} is displayed`,
            async function () {
                await studentSeeAllChaptersInCourse(learner, chapterNames);
            }
        );

        await learner.instruction(
            `Student see topic list of ${bookName} is displayed`,
            async function () {
                await studentSeeAllTopicsInCourse(learner, topicNames);
            }
        );
    }
);

Then(
    "student doesn't see books, chapters, topics of book {string} in Book Detail Screen",
    async function (this: IMasterWorld, book: string) {
        const learner = this.learner;
        const context = this.scenario;

        let bookContent: ContentBookProps;
        switch (book) {
            case 'B1':
                bookContent = context.get<ContentBookProps>(aliasRandomContentBookB1);
                break;
            case 'B3':
                bookContent = context.get<ContentBookProps>(aliasRandomContentBookB3);
                break;
            default:
                throw 'Not implement';
        }

        const chapterNames = bookContent.chapterList.map((chapter) => chapter.info!.name);
        const topicNames = bookContent.topicList.map((topic) => topic.name);
        const bookName = bookContent.book.name;
        await learner.instruction(
            `Student doesn't see book ${bookName} is displayed`,
            async function () {
                await studentNotSeeSelectedBookNameInCourseDetail(learner, bookName);
            }
        );

        await learner.instruction(
            `Student doesn't see chapter list of ${bookName} is displayed`,
            async function () {
                await studentNotSeeAllChaptersInCourse(learner, chapterNames);
            }
        );

        await learner.instruction(
            `Student doesn't see topic list of ${bookName} is displayed`,
            async function () {
                await studentNotSeeAllTopicsInCourse(learner, topicNames);
            }
        );
    }
);

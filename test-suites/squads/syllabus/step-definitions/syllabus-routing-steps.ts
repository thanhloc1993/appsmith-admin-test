import { bookDetailScreenRoute } from '@legacy-step-definitions/endpoints';

import { When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { aliasCourseId } from './alias-keys/syllabus';

When(
    'student goes to Book Detail Screen by using browser address',
    async function (this: IMasterWorld) {
        const learner = this.learner;
        const context = this.scenario;

        const courseId = context.get<string>(aliasCourseId);
        const domainUrl = learner.page!.url().split('#')[0] + '#/';

        const bookDetailScreenPath = `${domainUrl}${bookDetailScreenRoute(courseId)}`;
        await learner.instruction(
            `student enters ${bookDetailScreenPath} on browser address`,
            async function () {
                await learner.page!.goto(bookDetailScreenPath);
            }
        );
    }
);

When(
    'student goes to Book Detail Screen by using wrong param in browser address',
    async function (this: IMasterWorld) {
        const learner = this.learner;
        const context = this.scenario;

        const courseId = context.get<string>(aliasCourseId);
        const domainUrl = learner.page!.url().split('#')[0] + '#/';

        const bookDetailScreenPathWithWrongParam = `${domainUrl}${bookDetailScreenRoute(
            courseId.slice(0, -1)
        )}`;
        await learner.instruction(
            `student enters ${bookDetailScreenPathWithWrongParam} on browser address`,
            async function () {
                await learner.page!.goto(bookDetailScreenPathWithWrongParam);
            }
        );
    }
);

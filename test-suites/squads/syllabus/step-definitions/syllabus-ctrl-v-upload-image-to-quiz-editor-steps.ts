import { DataTable, Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { QuizTypeTitle } from '@supports/types/cms-types';

import {
    schoolAdminPasteScreenshotToLOQuestionAndSave,
    schoolAdminHasPasteScreenshotToLOQuestionWhenEdit,
    schoolAdminSeeImageShowOnQuiz,
    schoolAdminPaste2ndImageToQuizAndSave,
    schoolAdminPasteScreenshotToLOQuestion,
    schoolAdminSaveQuizWhenImageUploading,
    schoolAdminSeeLoadingImageOnQuiz,
} from './syllabus-ctrl-v-upload-image-to-quiz-editor-definitions';
import { schoolAdminWaitingQuestionDataSync } from './syllabus-migration-temp';
import {
    schoolAdminSelectCreateQuiz,
    schoolAdminWaitingQuizTableInTheLODetail,
} from './syllabus-question-utils';

When(
    'school admin pastes copied image into editor and saves {string} quiz',
    async function (this: IMasterWorld, quizTypeTitle: QuizTypeTitle, quizFieldsData: DataTable) {
        const context = this.scenario;

        await this.cms.instruction('school selects create quiz', async () => {
            await schoolAdminSelectCreateQuiz(this.cms);
        });

        await this.cms.instruction(
            `school admin pastes copied image into editor and saves ${quizTypeTitle} quiz`,
            async () => {
                await schoolAdminPasteScreenshotToLOQuestionAndSave(
                    this.cms,
                    quizTypeTitle,
                    context,
                    quizFieldsData
                );
            }
        );
    }
);
Then(
    'school admin sees image shown on every field of {string} quiz',
    async function (this: IMasterWorld, quizTypeTitle: QuizTypeTitle) {
        const context = this.scenario;

        await schoolAdminWaitingQuestionDataSync(this.cms);

        await this.cms.waitingForLoadingIcon();
        await schoolAdminWaitingQuizTableInTheLODetail(this.cms);

        await this.cms.instruction(
            `school admin sees image shown on every field of ${quizTypeTitle} quiz`,
            async (cms) => {
                await schoolAdminSeeImageShowOnQuiz(cms, quizTypeTitle, context, 1);
            }
        );
    }
);
Given(
    'school admin has pasted a copied image to {string} quiz',
    async function (this: IMasterWorld, quizTypeTitle: QuizTypeTitle, quizFieldsData: DataTable) {
        const context = this.scenario;
        await this.cms.instruction(
            `school admin has pasted a copied image to ${quizTypeTitle} quiz`,
            async (cms) => {
                await schoolAdminHasPasteScreenshotToLOQuestionWhenEdit(
                    cms,
                    quizTypeTitle,
                    quizFieldsData,
                    context
                );
            }
        );
    }
);

When(
    'school admin pastes 2nd copied image into editor and saves {string} quiz',
    async function (this: IMasterWorld, quizTypeTitle: QuizTypeTitle) {
        const context = this.scenario;
        await this.cms.instruction(
            `school admin pastes 2nd copied image into editor and saves ${quizTypeTitle} quiz`,
            async (cms) => {
                await schoolAdminPaste2ndImageToQuizAndSave(cms, quizTypeTitle, context);
            }
        );
    }
);

Then(
    'school admin sees {int} image shown on every field of {string} quiz',
    async function (this: IMasterWorld, numberImage: number, quizTypeTitle: QuizTypeTitle) {
        const context = this.scenario;

        await schoolAdminWaitingQuestionDataSync(this.cms);

        await this.cms.waitingForLoadingIcon();
        await schoolAdminWaitingQuizTableInTheLODetail(this.cms);

        await this.cms.instruction(
            `school admin sees ${numberImage} image shown on every field of ${quizTypeTitle} quiz`,
            async (cms) => {
                await schoolAdminSeeImageShowOnQuiz(cms, quizTypeTitle, context, numberImage);
            }
        );
        if (numberImage === 0) {
            await this.cms.instruction(
                `school admin checks loading image on every field of ${quizTypeTitle} quiz`,
                async (cms) => {
                    await schoolAdminSeeLoadingImageOnQuiz(cms, quizTypeTitle, context, 0);
                }
            );
        }
    }
);

When(
    'school admin pastes copied image to {string} quiz',
    async function (this: IMasterWorld, quizTypeTitle: QuizTypeTitle, quizFieldsData: DataTable) {
        const context = this.scenario;

        await this.cms.instruction('school admin selects create quiz', async () => {
            await schoolAdminSelectCreateQuiz(this.cms);
        });

        await this.cms.instruction(
            `school admin pastes copied image into editor and saves ${quizTypeTitle} quiz`,
            async (cms) => {
                await schoolAdminPasteScreenshotToLOQuestion(
                    cms,
                    quizTypeTitle,
                    context,
                    quizFieldsData
                );
            }
        );
    }
);

When(
    'school admin sees copied image is uploading and saves {string} quiz',
    async function (this: IMasterWorld, quizTypeTitle: QuizTypeTitle) {
        const context = this.scenario;
        await this.cms.instruction(
            `school admin sees copied image is uploading and saves ${quizTypeTitle} quiz`,
            async (cms) => {
                await schoolAdminSaveQuizWhenImageUploading(cms, quizTypeTitle, context);
            }
        );
    }
);

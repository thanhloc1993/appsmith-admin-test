import { learnerProfileAlias } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import {
    getLearnerInterfaceFromRole,
    getUsersFromContextByRegexKeys,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    aliasLessonId,
    aliasMaterialName,
    aliasStartDate,
} from 'test-suites/squads/lesson/common/alias-keys';
import { getStudentInfoByUserProfile } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';
import { MaterialFileState, SingleMaterialFile } from 'test-suites/squads/lesson/types/material';
import { createLessonByUI } from 'test-suites/squads/lesson/utils/lesson-upsert';
import { convertToMaterialType } from 'test-suites/squads/lesson/utils/materials';
import { staffProfileAlias } from 'test-suites/squads/timesheet/common/alias-keys';
import {
    assertMaterialButtonVisibleOnLearnerApp,
    assertMaterialNameVisibleOnLearnerApp,
    assertMaterialVisibleOnLearnerApp,
    previewMaterialOnLearnerApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/student-can-not-see-material-button-definitions';
import { annotatedPdfPrefixName } from 'test-suites/squads/virtual-classroom/utils/constants';
import {
    learnerOpensCalendarOnLearnerApp,
    learnerSelectsRespectiveLessonDateOnTheCalendar,
} from 'test-suites/squads/virtual-classroom/utils/lesson';
import { navigateToMaterialPageOnLearnerApp } from 'test-suites/squads/virtual-classroom/utils/navigation';
import {
    getMaterialNamesFromContext,
    removeExtensionOfFile,
} from 'test-suites/squads/virtual-classroom/utils/utils';

Given(
    'school admin has created a {string} lesson of lesson management with attached {string} on CMS',
    { timeout: 300000 },
    async function (lessonTime: LessonManagementLessonTime, rawMaterial: string) {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;
        const materials = convertToMaterialType(rawMaterial);
        const teachingMethod = LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL;
        const teachers = getUsersFromContextByRegexKeys(scenarioContext, staffProfileAlias);
        const learners = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias);
        const teacherNames = teachers.map((user) => user.name);
        const studentInfos = learners.map((learner) =>
            getStudentInfoByUserProfile(scenarioContext, learner)
        );
        await cms.instruction(
            `school admin has created a lesson of lesson management with attached ${rawMaterial} on CMS`,
            async function () {
                await createLessonByUI({
                    cms,
                    scenarioContext,
                    lessonTime,
                    materials,
                    teachingMedium: 'LESSON_TEACHING_MEDIUM_ONLINE',
                    lessonActionSave: 'Published',
                    teachingMethod,
                    teacherNames,
                    studentInfos,
                });
            }
        );
    }
);

Given('{string} has gone to materials page on Learner App', async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    const lessonId = this.scenario.get(aliasLessonId);
    const startTime = new Date(this.scenario.get(aliasStartDate));
    await learner.instruction(
        `${role} has gone to materials page on Learner App`,
        async function () {
            await learnerOpensCalendarOnLearnerApp(learner);
            await learnerSelectsRespectiveLessonDateOnTheCalendar(learner, startTime);
            await navigateToMaterialPageOnLearnerApp(learner, lessonId);
        }
    );
});

Given(
    '{string} has previewed annotated {string} on Learner App',
    async function (role: AccountRoles, file: SingleMaterialFile) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const materialName = this.scenario.get(aliasMaterialName[file]);
        await learner.instruction(
            `${role} has previewed annotated ${file} on Learner App`,
            async function () {
                await previewMaterialOnLearnerApp(learner, materialName);
            }
        );
    }
);

When(
    '{string} preview annotated {string} on Learner App',
    async function (role: AccountRoles, file: SingleMaterialFile) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const materialName = this.scenario.get(aliasMaterialName[file]);
        await learner.instruction(
            `${role} preview annotated ${file} on Learner App`,
            async function () {
                await previewMaterialOnLearnerApp(learner, materialName);
            }
        );
    }
);

Then(
    '{string} {string} material button beside join button on Learner App',
    async function (role: AccountRoles, state: MaterialFileState) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const lessonId = this.scenario.get(aliasLessonId);
        await learner.instruction(
            `${role} ${state} material button beside join button on Learner App`,
            async function () {
                await assertMaterialButtonVisibleOnLearnerApp(
                    learner,
                    lessonId,
                    state === 'can see'
                );
            }
        );
    }
);

When('{string} goes to materials page on Learner App', async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    const lessonId = this.scenario.get(aliasLessonId);
    const startTime = new Date(this.scenario.get(aliasStartDate));
    await learner.instruction(`${role} goes to materials page on Learner App`, async function () {
        await learnerOpensCalendarOnLearnerApp(learner);
        await learnerSelectsRespectiveLessonDateOnTheCalendar(learner, startTime);
        await navigateToMaterialPageOnLearnerApp(learner, lessonId);
    });
});

Then(
    '{string} {string} file name with form: [original PDF file name]_note',
    async function (role: AccountRoles, state: MaterialFileState) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const materialNames = (await getMaterialNamesFromContext(this.scenario)).filter(
            (material) => material.includes('pdf')
        );
        const visible = state === 'can see';

        for (const materialName of materialNames) {
            await learner.instruction(
                `${role} ${state} file name with form: [original PDF file name]_note`,
                async function () {
                    await assertMaterialVisibleOnLearnerApp(learner, materialName, visible);
                    await assertMaterialNameVisibleOnLearnerApp(
                        learner,
                        `${removeExtensionOfFile(materialName)}${annotatedPdfPrefixName}`,
                        visible
                    );
                }
            );
        }
    }
);

Then(
    '{string} {string} any file name without including _note',
    async function (role: AccountRoles, state: MaterialFileState) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const materialNames = (await getMaterialNamesFromContext(this.scenario))
            .filter((material) => material.includes('pdf'))
            .map((materialName) => removeExtensionOfFile(materialName));
        const visible = state === 'can see';

        for (const materialName of materialNames) {
            await learner.instruction(
                `${role} ${state} any file name without including _note`,
                async function () {
                    await assertMaterialNameVisibleOnLearnerApp(learner, materialName, visible);
                }
            );
        }
    }
);

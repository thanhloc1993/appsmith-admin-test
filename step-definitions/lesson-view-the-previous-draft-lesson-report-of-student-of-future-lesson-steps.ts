import { Given } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { aliasLessonIdForPreviousReport } from './alias-keys/lesson';
import { saveDraftIndividualLessonReport } from './lesson-teacher-save-draft-individual-lesson-report-definitions';
import {
    fulfillLessonReportInfo,
    openLessonReportUpsertDialog,
} from './lesson-teacher-submit-individual-lesson-report-definitions';
import {
    createLessonForCurrentStudent,
    goToNewCreatedLesson,
} from './lesson-view-the-previous-submitted-lesson-report-of-student-of-future-lesson-definitions';
import { getCMSInterfaceByRole } from './utils';

Given(
    '{string} has created draft previous lesson report for this student in this course',
    async function (role: AccountRoles) {
        const cmsSchoolAdmin = this.cms;
        const cmsTeacher = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        await cmsSchoolAdmin.instruction(
            `school admin creates a lesson for current student`,
            async function () {
                await createLessonForCurrentStudent(cmsSchoolAdmin, scenarioContext);
            }
        );

        await cmsTeacher.instruction(`${role} goes to new created lesson`, async function () {
            const newLessonId = scenarioContext.get(aliasLessonIdForPreviousReport);
            await goToNewCreatedLesson(cmsTeacher, newLessonId);
        });

        await cmsTeacher.instruction('Open lesson report upsert dialog', async function () {
            await openLessonReportUpsertDialog(cmsTeacher);
        });

        await cmsTeacher.instruction(`${role} fulfills lesson report info`, async function () {
            await fulfillLessonReportInfo(cmsTeacher);
        });

        await cmsTeacher.instruction(`${role} save draft lesson report`, async function () {
            await saveDraftIndividualLessonReport(cmsTeacher);
        });
    }
);

import { asyncForEach } from '@syllabus-utils/common';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Then } from '@cucumber/cucumber';

import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { delay } from 'flutter-driver-x';
import { studentRefreshHomeScreen } from 'test-suites/common/step-definitions/student-screen-definitions';
import { teacherSeeStudyPlan } from 'test-suites/common/step-definitions/teacher-study-plan-definitions';
import { aliasCourseId } from 'test-suites/squads/lesson/common/alias-keys';
import {
    aliasCourseName,
    aliasCourseStudyPlans,
    aliasStudentStudyPlanRowIndex,
    aliasStudyPlanName,
} from 'test-suites/squads/syllabus/step-definitions/alias-keys/syllabus';
import { StudyPlan } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';
import {
    schoolAdminAddCourseForStudent,
    teacherGoToCourseStudentDetail,
} from 'test-suites/squads/syllabus/step-definitions/create-course-studyplan-definitions';
import { studentSeeNothingInCourse } from 'test-suites/squads/syllabus/step-definitions/syllabus-add-book-to-course-definitions';
import {
    schoolAdminSeeStudyPlanByStudentRowIndex,
    schoolAdminSelectStudyPlanTabByType,
} from 'test-suites/squads/syllabus/step-definitions/syllabus-study-plan-common-definitions';
import {
    getGradesStringOrEmptyGradesString,
    studentGoToCourseDetail,
} from 'test-suites/squads/syllabus/step-definitions/syllabus-utils';

Then('school admin sees individual SP of student in course active', async function () {
    const courseStudyPlanList = this.scenario.get<StudyPlan[]>(aliasCourseStudyPlans);
    const studentRowIndex = this.scenario.get<number>(aliasStudentStudyPlanRowIndex) || 0;

    await this.cms.instruction(`School admin goes to individual study plan tab`, async () => {
        await schoolAdminSelectStudyPlanTabByType(this.cms, 'student');
    });

    const studentName = (await this.learner.getProfile()).name;

    await this.cms.instruction(
        `School admin sees the active study plans of student ${studentName} in individual tab`,
        async () => {
            await asyncForEach(courseStudyPlanList, async (studyPlan, studyPlanIndex) => {
                const { name: studyPlanName, bookName, gradesList } = studyPlan;
                const studentStudyPlanIndex = studentRowIndex + studyPlanIndex;
                const gradesString = getGradesStringOrEmptyGradesString(gradesList);

                await schoolAdminSeeStudyPlanByStudentRowIndex(this.cms, studentStudyPlanIndex, {
                    studyPlanName,
                    bookName,
                    gradesString,
                });
            });
        }
    );
});

Then(
    'student in course do not see unavailable items of the active master study plan',
    async function () {
        const courseName = this.scenario.get(aliasCourseName);

        await this.learner.instruction('Student refreshes learner app', async () => {
            await studentRefreshHomeScreen(this.learner);
        });

        await this.learner.instruction('Student goes to the course student detail', async () => {
            await studentGoToCourseDetail(this.learner, courseName);
        });

        await this.learner.instruction(`Student sees nothing in ${courseName}`, async () => {
            await studentSeeNothingInCourse(this.learner);
        });
    }
);

Then('teacher sees the study plan of student on Teacher App', async function () {
    const courseId = this.scenario.get(aliasCourseId);
    const studyPlanName = this.scenario.get(aliasStudyPlanName);

    const profile = await this.learner.getProfile();

    await this.teacher.instruction(
        `Teacher goes to the course student detail: ${profile.name}`,
        async () => {
            await teacherGoToCourseStudentDetail(this.teacher, courseId, profile.id);
        }
    );

    await this.teacher.instruction(`Teacher sees study plan of ${profile.name}`, async () => {
        await teacherSeeStudyPlan(this.teacher, studyPlanName);
    });
});

Then('school admin has added student S1 to the course', async function () {
    const context = this.scenario;
    const courseId = this.scenario.get(aliasCourseId);

    const learner = context.get<UserProfileEntity>(
        learnerProfileAliasWithAccountRoleSuffix('student S1')
    );

    await this.cms.instruction('School admin adds student to the course', async () => {
        await schoolAdminAddCourseForStudent(this.cms, learner, courseId);
        // TODO: need to wait for user data sync before create study plan
        await delay(5000);
    });
});

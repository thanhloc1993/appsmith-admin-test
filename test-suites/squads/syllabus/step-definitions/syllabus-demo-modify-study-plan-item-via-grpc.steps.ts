import { getRandomElement, getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given } from '@cucumber/cucumber';

import {
    aliasCourseId,
    aliasRandomBooks,
    aliasRandomStudyPlanItems,
    aliasStudyPlanItems,
    aliasStudyPlanName,
    aliasTrackSchoolProgress,
} from './alias-keys/syllabus';
import { schoolAdminHasCreatedStudyPlanV2 } from './syllabus-study-plan-common-definitions';
import { mapStudyPlanItemWithInfo } from './syllabus-study-plan-item-common-definitions';
import {
    Book,
    StudyPlanItem as LearningObjectiveOrAssignment,
    StudyPlanItemStructure,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';
import { addCoursesForStudent } from 'test-suites/squads/user-management/step-definitions/user-update-student-definitions';

Given('school admin has created a matched studyplan', async function () {
    const courseId = this.scenario.get(aliasCourseId);
    const bookList = this.scenario.get<Book[]>(aliasRandomBooks);
    const studyPlanItemRandoms =
        this.scenario.get<LearningObjectiveOrAssignment[]>(aliasRandomStudyPlanItems);

    const { studyPlanName, studyPlanItemRaws } = await schoolAdminHasCreatedStudyPlanV2(
        this.cms,
        courseId,
        bookList,
        {
            studyPlanItems: studyPlanItemRandoms,
        }
    );

    const studyPlanItems: StudyPlanItemStructure[] = mapStudyPlanItemWithInfo(
        studyPlanItemRaws,
        studyPlanItemRandoms
    );

    this.scenario.set(aliasStudyPlanItems, studyPlanItems);
    this.scenario.set(aliasStudyPlanName, studyPlanName);
});

Given(
    'school admin has created a matched studyplan {string} track school progress for student',
    async function (trackSchoolProgress: 'with' | 'without') {
        const context = this.scenario;
        const courseId = context.get(aliasCourseId);
        const bookList = context.get<Book[]>(aliasRandomBooks);
        const studentProfile = getUserProfileFromContext(
            context,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );
        const studyPlanItemRandoms =
            context.get<LearningObjectiveOrAssignment[]>(aliasRandomStudyPlanItems);
        await this.cms.instruction(
            'Add a course for student by calling gRPC',
            async function (cms) {
                const courseIdList = [courseId];
                const randomLocation = getRandomElement(studentProfile.locations || []);

                await addCoursesForStudent(cms, {
                    courseIds: courseIdList,
                    studentId: studentProfile.id,
                    locationId: randomLocation.locationId,
                });
            }
        );
        await schoolAdminHasCreatedStudyPlanV2(this.cms, courseId, bookList, {
            studyPlanItems: studyPlanItemRandoms,
            customStudyPlan: {
                trackSchoolProgress: trackSchoolProgress == 'with',
            },
            studyplanTestCase: 'available',
        });

        this.scenario.set(aliasTrackSchoolProgress, trackSchoolProgress == 'with');
    }
);

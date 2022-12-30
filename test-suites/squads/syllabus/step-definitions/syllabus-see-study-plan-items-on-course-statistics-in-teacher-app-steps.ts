import { delay } from '@legacy-step-definitions/utils';
import { courseAliasWithSuffix } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { Books, Courses, IMasterWorld, StudyPlans, TeacherInterface } from '@supports/app-types';
import NsMasterCourseService from '@supports/services/master-course-service/request-types';

import {
    aliasCourseId,
    aliasCourseName,
    aliasRandomStudyPlanItems,
    aliasTopicName,
} from './alias-keys/syllabus';
import { teacherTapsOnTopic } from './syllabus-expand-collapse-topic-definitions';
import {
    teacherGoesToCourseDetails,
    teacherGoesToCourseStatistics,
    teacherSeeCourseTopicStudyPlanItem,
    teacherSeeEmptyPageOnCourseStatistics,
} from './syllabus-see-study-plan-items-on-course-statistics-in-teacher-app-definitions';
import {
    Assignment,
    CreatedContentBookReturn,
    isAssignment,
    LearningObjective,
    StudyPlanItem,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

When(`teacher is at course statistics screen`, async function (this: IMasterWorld): Promise<void> {
    const context = this.scenario;
    const courseName = context.get<string>(aliasCourseName);
    const courseId = context.get<string>(aliasCourseId);

    await this.teacher.instruction(
        `teacher goes to course ${courseName} from home page`,
        async function (this: TeacherInterface) {
            await teacherGoesToCourseDetails(this, courseId);
        }
    );

    await this.teacher.instruction(
        `teacher goes to course statistics`,
        async function (this: TeacherInterface) {
            await this.flutterDriver?.reload();
            await teacherGoesToCourseStatistics(this);
        }
    );
});

When(
    `teacher is at course statistics screen of {string}`,
    async function (this: IMasterWorld, courses: Courses): Promise<void> {
        const course = this.scenario.get<NsMasterCourseService.UpsertCoursesRequest>(
            courseAliasWithSuffix(courses)
        );
        const courseId = course.id;
        const courseName = course.name;

        await this.teacher.instruction(
            `teacher goes to course ${courseName} from home page`,
            async function (this: TeacherInterface) {
                await teacherGoesToCourseDetails(this, courseId);
            }
        );

        await this.teacher.instruction(
            `teacher goes to course statistics`,
            async function (this: TeacherInterface) {
                await delay(15000); // TODO: need to remove by add a key to wait for loader close instead
                await teacherGoesToCourseStatistics(this);
            }
        );
    }
);

Then(
    `teacher sees course statistics study plan items`,
    { timeout: 300000 },
    async function (): Promise<void> {
        const context = this.scenario;

        const topicName = context.get<string>(aliasTopicName);

        await delay(10000);

        await this.teacher.instruction(
            `teacher taps on a topic ${topicName}`,
            async function (this: TeacherInterface) {
                await teacherTapsOnTopic(this, topicName);
            }
        );

        const studyPlanItemList = context.get<StudyPlanItem[]>(aliasRandomStudyPlanItems);

        const studyPlanItems: string[] = studyPlanItemList.map((studyPlanItem) => {
            if (isAssignment(studyPlanItem)) {
                const assignment = studyPlanItem as Assignment;
                return assignment.name;
            } else {
                const lo = studyPlanItem as LearningObjective;
                return lo.info.name;
            }
        });

        for (const studyPlanName of studyPlanItems) {
            await this.teacher.instruction(
                `teacher sees the ${studyPlanName} on Teacher App`,
                async function (teacher: TeacherInterface) {
                    await teacherSeeCourseTopicStudyPlanItem(teacher, studyPlanName);
                }
            );
        }
    }
);

Then(
    `teacher sees course statistics study plan items of {string}`,
    { timeout: 300000 },
    async function (studyPlan: StudyPlans): Promise<void> {
        const book = studyPlan == 'study plan SP1' ? 'book B1' : ('book B2' as Books);
        const bookData = this.scenario.get<CreatedContentBookReturn>(book);
        const topics = bookData.topicList;
        const topicNames = topics.map((topic) => topic.name);

        await delay(30000);

        await this.teacher.instruction(
            `teacher taps on a topic ${topicNames[0]}`,
            async function (this: TeacherInterface) {
                await teacherTapsOnTopic(this, topicNames[0]);
            }
        );

        const studyPlanItemList = bookData.studyPlanItemList;

        const studyPlanItems: string[] = studyPlanItemList.map((studyPlanItem) => {
            if (isAssignment(studyPlanItem)) {
                const assignment = studyPlanItem as Assignment;
                return assignment.name;
            } else {
                const lo = studyPlanItem as LearningObjective;
                return lo.info.name;
            }
        });

        for (const studyPlanName of studyPlanItems) {
            await this.teacher.instruction(
                `teacher sees the ${studyPlanName} on Teacher App`,
                async function (teacher: TeacherInterface) {
                    await teacherSeeCourseTopicStudyPlanItem(teacher, studyPlanName);
                }
            );
        }
    }
);

Then(
    `teacher sees an empty page on course statistics`,
    async function (this: IMasterWorld): Promise<void> {
        await this.teacher.instruction(
            `teacher sees an empty page`,
            async function (this: TeacherInterface) {
                await teacherSeeEmptyPageOnCourseStatistics(this);
            }
        );
    }
);

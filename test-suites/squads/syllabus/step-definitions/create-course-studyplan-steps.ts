import { schoolAdminSeeEmptyTableMsg } from '@legacy-step-definitions/cms-common-definitions';
import { asyncForEach } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { CMSInterface, IMasterWorld, LearnerInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    aliasBookIds,
    aliasCourseBookDownloadPath,
    aliasCourseId,
    aliasCourseName,
    aliasRandomStudyPlanItems,
    aliasRandomTopics,
    aliasStudyPlanName,
} from './alias-keys/syllabus';
import {
    createStudyPlan,
    schoolAdminAddMultipleStudentToCourse,
    schoolAdminAssertStudyPlanOnCMS,
    schoolAdminChooseStudentStudyPlanTab,
    schoolAdminExpandStudyPlan,
    schoolAdminGotoCourseDetail,
    schoolAdminSeeStudyPlanInStudent,
    schoolAdminWaitingStudyPlanInsert,
    selectBookInTheCourse,
    teacherGoToCourseStudentDetail,
    teacherSeeStudyPlan,
} from './create-course-studyplan-definitions';
import {
    addBooksToCourseByGRPC,
    studentSeeNothingInCourse,
} from './syllabus-add-book-to-course-definitions';
import {
    schoolAdminSeeStudyPlanInMasterTable,
    schoolAdminSeeStudyPlanItemsByTopicsBaseOnBook,
    schoolAdminSelectStudyPlanOfStudent,
    schoolAdminSelectStudyPlanTabByType,
    schoolAdminWaitingStudyPlanDetailLoading,
} from './syllabus-study-plan-common-definitions';
import { downloadBookCourse } from './syllabus-study-plan-upsert-definitions';
import { studentGoToCourseDetail, studentRefreshHomeScreen } from './syllabus-utils';
import { schoolAdminChooseTabInCourseDetail } from 'test-suites/common/step-definitions/course-definitions';
import {
    StudyPlanItem,
    Topic,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';
import { createARandomStudentGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

When('school admin uploads the book csv to course', async function () {
    const downloadedPath = this.scenario.get<string>(aliasCourseBookDownloadPath);

    await this.cms.instruction('User select the study plan tab', async () => {
        await schoolAdminChooseTabInCourseDetail(this.cms, 'studyPlanCSV');
    });

    await this.cms.instruction('User upload the book csv downloaded ago', async () => {
        await createStudyPlan(this.cms, this.scenario, downloadedPath);
    });

    await schoolAdminWaitingStudyPlanInsert(this.cms);
});

Then('school admin sees a new matched studyplan created for course on CMS', async function () {
    await this.cms.instruction('See a new study plan', async () => {
        await schoolAdminAssertStudyPlanOnCMS(this.cms);
    });
});

Then(
    'school admin sees a new matched studyplan created for master studyplan V2 on CMS',
    async function () {
        const studyPlanName = this.scenario.get(aliasStudyPlanName);
        await this.cms.instruction(
            `School admin sees a new study plan ${studyPlanName}`,
            async () => {
                await schoolAdminSeeStudyPlanInMasterTable(this.cms, studyPlanName);
            }
        );
    }
);

Given(
    'school admin has added student S1 and student S2 to the course',
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const courseId = await this.scenario.get(aliasCourseId);

        const learner1 = context.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix('student S1')
        );
        const learner2 = context.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix('student S2')
        );

        const learnerProfiles = [learner1, learner2];

        await this.cms.instruction('Add multiple student to the course', async () => {
            await schoolAdminAddMultipleStudentToCourse(this.cms, learnerProfiles, courseId);
        });
    }
);

Given('school admin has added student to the course', async function () {
    const courseId = this.scenario.get(aliasCourseId);

    const { student } = await createARandomStudentGRPC(this.cms, {});

    await this.cms.instruction('Add student to the course', async () => {
        await schoolAdminAddMultipleStudentToCourse(this.cms, [student], courseId);
    });
});

Given('school admin downloads the book from course', async function () {
    const context = this.scenario;
    const courseId = context.get<string>(aliasCourseId);

    await this.cms.instruction(`User go to the course: ${courseId} detail`, async () => {
        await schoolAdminGotoCourseDetail(this.cms, courseId);
    });

    await this.cms.instruction('User select the book tab', async () => {
        await schoolAdminChooseTabInCourseDetail(this.cms, 'book');
    });

    await this.cms.instruction('Select book in the course', async () => {
        await selectBookInTheCourse(this.cms);
    });

    await this.cms.instruction('Download the book selected', async () => {
        await downloadBookCourse(this.cms, context);
    });
});

Then(
    'teacher sees a new matched studyplan created for all students on Teacher App',
    async function () {
        const courseId = await this.scenario.get(aliasCourseId);
        const studyPlanName = this.scenario.get<string>(aliasStudyPlanName);

        const learners: LearnerInterface[] = [this.learner, this.learner2];

        await asyncForEach<LearnerInterface, void>(learners, async (learner) => {
            const profile = await learner.getProfile();

            await this.teacher.instruction(
                `Teacher go to the course student detail: ${profile.name}`,
                async () => {
                    await teacherGoToCourseStudentDetail(this.teacher, courseId, profile.id);
                }
            );

            await this.teacher.instruction(
                `Teacher assert study plan for ${profile.name}`,
                async () => {
                    await teacherSeeStudyPlan(this.teacher, studyPlanName);
                }
            );
        });
    }
);

Then(
    'teacher does not see new studyplan items created for any student on Teacher App',
    async function () {
        const courseId = await this.scenario.get(aliasCourseId);
        const learners: LearnerInterface[] = [this.learner, this.learner2];

        await asyncForEach<LearnerInterface, void>(learners, async (learner) => {
            const profile = await learner.getProfile();

            await this.teacher.instruction(
                `Teacher go to the course student detail: ${profile.name}`,
                async () => {
                    await teacherGoToCourseStudentDetail(this.teacher, courseId, profile.id);
                }
            );

            await this.teacher.instruction(
                `Teacher sees ${profile.name} have empty study plan items`,
                async () => {
                    // TODO: This only works in V1
                    // await teacherSeesStudentHaveEmptyStudyPlanItems(this.teacher);
                }
            );
        });
    }
);

Then('all students do not see new studyplan items on Learner App', async function () {
    const courseName = this.scenario.get<string>(aliasCourseName);
    const learners: LearnerInterface[] = [this.learner, this.learner2];

    await asyncForEach<LearnerInterface, void>(learners, async (learner) => {
        await learner.instruction('Refresh learner app', async () => {
            await studentRefreshHomeScreen(learner);
        });

        await learner.instruction('Student go to the course student detail', async () => {
            await studentGoToCourseDetail(learner, courseName);
        });

        await learner.instruction(`Student see nothings in the course: ${courseName}`, async () => {
            await studentSeeNothingInCourse(learner);
        });
    });
});

Given('school admin adds the content book for course', async function () {
    const courseId = this.scenario.get<string>(aliasCourseId);
    const bookIdsList = this.scenario.get<string[]>(aliasBookIds);

    await this.cms.instruction(
        'add a book to course by calling gRPC',
        async function (this: CMSInterface) {
            await addBooksToCourseByGRPC(this, courseId, bookIdsList);
        }
    );
});

Then(
    'school admin sees a new matched studyplan created for all students on CMS',
    async function () {
        const studyPlanName = this.scenario.get<string>(aliasStudyPlanName);
        const learners: LearnerInterface[] = [this.learner, this.learner2];

        await this.cms.instruction('School admin choose the student study plan tab', async () => {
            await schoolAdminChooseStudentStudyPlanTab(this.cms);
        });

        await asyncForEach<LearnerInterface, void>(learners, async (learner) => {
            const { name } = await learner.getProfile();

            await this.cms.instruction(`School admin expand student ${name}`, async () => {
                await this.cms.instruction(
                    `School admin expand study plan of ${name}`,
                    async () => {
                        await schoolAdminExpandStudyPlan(this.cms, name);
                    }
                );

                await this.cms.instruction(`School admin see study plan`, async () => {
                    await schoolAdminSeeStudyPlanInStudent(this.cms, name, studyPlanName);
                });
            });
        });
    }
);

Then(
    'school admin sees a new matched studyplan created for all students studyplan V2 on CMS',
    async function () {
        const studyPlanName = this.scenario.get<string>(aliasStudyPlanName);
        const learners: LearnerInterface[] = [this.learner, this.learner2];
        const topicList = this.scenario.get<Topic[]>(aliasRandomTopics);
        const studyPlanItemList = this.scenario.get<StudyPlanItem[]>(aliasRandomStudyPlanItems);

        await this.cms.instruction('School admin choose the student study plan tab', async () => {
            await schoolAdminSelectStudyPlanTabByType(this.cms, 'student');
        });

        await asyncForEach<LearnerInterface, void>(learners, async (learner) => {
            const { name } = await learner.getProfile();

            await this.cms.waitForSkeletonLoading();

            await this.cms.instruction(
                `School admin goes to the study plan ${studyPlanName} of student ${name}`,
                async () => {
                    await schoolAdminSelectStudyPlanOfStudent(this.cms, name, studyPlanName);
                }
            );

            await schoolAdminWaitingStudyPlanDetailLoading(this.cms);

            if (!studyPlanItemList) {
                await this.cms.instruction('School admin will see an empty table', async () => {
                    await schoolAdminSeeEmptyTableMsg(this.cms);
                });
            } else {
                await this.cms.instruction(
                    `School admin sees ${topicList.length} topics with ${studyPlanItemList.length} study plan items base on the book association`,
                    async () => {
                        await schoolAdminSeeStudyPlanItemsByTopicsBaseOnBook(
                            this.cms,
                            this.scenario,
                            topicList,
                            studyPlanItemList
                        );
                    }
                );
            }

            await this.cms.instruction(
                'School admin go back to the course study plan tab',
                async () => {
                    await this.cms.page?.goBack();
                    await schoolAdminSelectStudyPlanTabByType(this.cms, 'student');
                }
            );
        });
    }
);

Then(
    'school admin sees study plan items matched with {string} created',
    async function (testCase: 'empty') {
        const studyPlanItemList = this.scenario.get<StudyPlanItem[]>(aliasRandomStudyPlanItems);
        const topicList = this.scenario.get<Topic[]>(aliasRandomTopics);

        if (testCase === 'empty') {
            await this.cms.instruction('School admin will see an empty table', async () => {
                await schoolAdminSeeEmptyTableMsg(this.cms);
            });

            return;
        }

        await this.cms.instruction(
            `School admin sees ${topicList.length} topics with ${studyPlanItemList.length} study plan items base on the book association`,
            async () => {
                await schoolAdminSeeStudyPlanItemsByTopicsBaseOnBook(
                    this.cms,
                    this.scenario,
                    topicList,
                    studyPlanItemList
                );
            }
        );
    }
);

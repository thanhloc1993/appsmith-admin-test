import { asyncForEach, createNumberArrayWithLength } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { genId } from '@drivers/message-formatter/utils';

import studyPlanModifierService from '@supports/services/eureka-study_plan_modifier-service';

import {
    aliasCourseId,
    aliasCourseName,
    aliasRandomBooks,
    aliasRandomIndexStartEditStudyPlanItems,
    aliasRandomStudyPlanItems,
    aliasStudyPlanItemsTimes,
    aliasStudyPlanName,
} from './alias-keys/syllabus';
import {
    convertStudyPlanItemTimeToUI,
    generateStudyplanTimeAndConvertToStringInput,
    schoolAdminFakeCopyValueInputStudyPlanTime,
    schoolAdminFocusToTheFirstInputOfStudyPlanItem,
    schoolAdminSeeValueInTheStudyPlanItemCell,
} from './edit-study-plan-item-by-past-and-tab-definitions';
import { addBooksToCourseByGRPC } from './syllabus-add-book-to-course-definitions';
import {
    schoolAdminSelectCourseStudyPlan,
    schoolAdminSelectEditStudyPlanItems,
    schoolAdminWaitingStudyPlanDetailLoading,
} from './syllabus-study-plan-common-definitions';
import {
    schoolAdminBulkActionStudyPlanItems,
    schoolAdminWaitingUpdateStudyPlanItems,
} from './syllabus-study-plan-item-common-definitions';
import { StudyPlanStatus } from 'manabuf/eureka/v1/enums_pb';
import { createRandomCourses } from 'test-suites/common/step-definitions/course-definitions';
import {
    Book,
    StudyPlanItemStructureTime,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';
import { randomInteger } from 'test-suites/squads/syllabus/utils/common';

Given('school admin has created a matched studyplan for integration', async function () {
    const bookList = this.scenario.get<Book[]>(aliasRandomBooks);

    const { schoolId } = await this.cms.getContentBasic();
    const token = await this.cms.getToken();

    await this.cms.instruction('Create a course by calling gRPC', async () => {
        const { request } = await createRandomCourses(this.cms);

        this.scenario.set(aliasCourseId, request[0].id);
        this.scenario.set(aliasCourseName, request[0].name);
    });

    const bookIds = bookList.map((book) => book.bookId);

    const courseId = this.scenario.get(aliasCourseId);

    await this.cms.instruction('add a book to course by calling gRPC', async () => {
        await addBooksToCourseByGRPC(this.cms, courseId, bookIds);
    });

    await this.cms.instruction('upsertStudyPlan via GRPC', async () => {
        const studyPlanName = `Study plan ${genId()}`;
        await studyPlanModifierService.upsertStudyPlan(token, {
            bookId: bookIds[0],
            courseId,
            gradesList: [],
            schoolId,
            status: StudyPlanStatus.STUDY_PLAN_STATUS_ACTIVE,
            name: studyPlanName,
            trackSchoolProgress: false,
        });

        this.scenario.set(aliasStudyPlanName, studyPlanName);
    });
});

Given('school admin goes to the study plan detail', async function () {
    const studyPlanName = this.scenario.get(aliasStudyPlanName);

    await this.cms.instruction(`User click into study plan ${studyPlanName}`, async () => {
        await schoolAdminSelectCourseStudyPlan(this.cms, studyPlanName);
    });

    await schoolAdminWaitingStudyPlanDetailLoading(this.cms);
});

When('school admin edits time by copy-paste value and goes to the next input', async function () {
    await schoolAdminSelectEditStudyPlanItems(this.cms);

    const studyPlanItemSizes = this.scenario.get<[]>(aliasRandomStudyPlanItems).length;

    const randomTotalElementsToEdit = randomInteger(3, studyPlanItemSizes);

    const randomIndexStartEdit = randomInteger(0, studyPlanItemSizes - randomTotalElementsToEdit);

    const studyPlanItemsTimes: StudyPlanItemStructureTime[] = [];

    await asyncForEach(createNumberArrayWithLength(randomTotalElementsToEdit), async (_, index) => {
        const times = generateStudyplanTimeAndConvertToStringInput(
            'paste and tab for integration test'
        );
        const { availableFrom, availableTo, startDate, endDate } = times;

        if (index === 0) {
            await schoolAdminFocusToTheFirstInputOfStudyPlanItem(this.cms, randomIndexStartEdit);
        }

        await this.cms.instruction(`School admin copies ${availableFrom}`, async () => {
            await schoolAdminFakeCopyValueInputStudyPlanTime(this.cms, availableFrom);
        });

        await this.cms.instruction(
            'School admin pastes value into available from time input',
            async () => {
                await this.cms.page?.keyboard.press('Control+v');
            }
        );

        await this.cms.instruction(`School admin tabs to the next input`, async () => {
            await this.cms.page?.keyboard.press('Tab');
        });

        await this.cms.instruction(`School admin copies ${availableTo}`, async () => {
            await schoolAdminFakeCopyValueInputStudyPlanTime(this.cms, availableTo);
        });

        await this.cms.instruction(
            'School admin pastes value into available to time input',
            async () => {
                await this.cms.page?.keyboard.press('Control+v');
            }
        );

        await this.cms.instruction(`School admin tabs to the next input`, async () => {
            await this.cms.page?.keyboard.press('Tab');
        });

        await this.cms.instruction(`School admin copies ${startDate}`, async () => {
            await schoolAdminFakeCopyValueInputStudyPlanTime(this.cms, startDate);
        });

        await this.cms.instruction(`School admin pastes value into start time input`, async () => {
            await this.cms.page?.keyboard.press('Control+v');
        });

        await this.cms.instruction(`School admin tabs to the next input`, async () => {
            await this.cms.page?.keyboard.press('Tab');
        });

        await this.cms.instruction(`School admin copies ${endDate}`, async () => {
            await schoolAdminFakeCopyValueInputStudyPlanTime(this.cms, endDate);
        });

        await this.cms.instruction(`School admin pastes value into end time input`, async () => {
            await this.cms.page?.keyboard.press('Control+v');
        });

        if (index < randomTotalElementsToEdit - 1) {
            await this.cms.instruction(
                `School admin tabs to jump to the next study plan item`,
                async () => {
                    await this.cms.page?.keyboard.press('Tab');
                }
            );
        }

        studyPlanItemsTimes.push(times);
    });

    this.scenario.set(aliasStudyPlanItemsTimes, studyPlanItemsTimes);
    this.scenario.set(aliasRandomIndexStartEditStudyPlanItems, randomIndexStartEdit);

    await this.cms.instruction(`School admin saves study plan items after edited`, async () => {
        await schoolAdminBulkActionStudyPlanItems(this.cms, 'save');
    });

    await schoolAdminWaitingUpdateStudyPlanItems(this.cms);
});

Then('school admin sees study plan items time updated', async function () {
    const studyPlanItemsTimes =
        this.scenario.get<Required<StudyPlanItemStructureTime>[]>(aliasStudyPlanItemsTimes);

    const indexStartEdit = this.scenario.get<number>(aliasRandomIndexStartEditStudyPlanItems);

    await asyncForEach(studyPlanItemsTimes, async (studyPlanItemTimes, index) => {
        const { availableFrom, availableTo, endDate, startDate } = studyPlanItemTimes;
        const tableRowIndex = indexStartEdit + index;

        const availableToDisplay = convertStudyPlanItemTimeToUI(availableTo);
        const availableFromDisplay = convertStudyPlanItemTimeToUI(availableFrom);
        const startDateDisplay = convertStudyPlanItemTimeToUI(startDate);
        const endDateDisplay = convertStudyPlanItemTimeToUI(endDate);

        const instruction = `User will see study plan item at index ${tableRowIndex} will show
        availableFrom ${availableFromDisplay},
        availableTo ${availableToDisplay},
        startDate ${startDateDisplay},
        endDate ${endDateDisplay}`;

        await this.cms.instruction(instruction, async () => {
            await schoolAdminSeeValueInTheStudyPlanItemCell(
                this.cms,
                'availableFrom',
                tableRowIndex,
                availableFromDisplay
            );
            await schoolAdminSeeValueInTheStudyPlanItemCell(
                this.cms,
                'availableTo',
                tableRowIndex,
                availableToDisplay
            );
            await schoolAdminSeeValueInTheStudyPlanItemCell(
                this.cms,
                'startDate',
                tableRowIndex,
                startDateDisplay
            );
            await schoolAdminSeeValueInTheStudyPlanItemCell(
                this.cms,
                'endDate',
                tableRowIndex,
                endDateDisplay
            );
        });
    });
});

When(
    'school admin edits times by copy-paste start time which {string} and goes to due date',
    async function (
        startTimeTestCase:
            | 'less than availableTime 7 days'
            | 'greater than or equal availableTime 7 days'
            | 'none'
    ) {
        await schoolAdminSelectEditStudyPlanItems(this.cms);

        const studyPlanItemSizes = this.scenario.get<[]>(aliasRandomStudyPlanItems).length;

        const randomTotalElementsToEdit = randomInteger(3, studyPlanItemSizes);

        const randomIndexStartEdit = randomInteger(
            0,
            studyPlanItemSizes - randomTotalElementsToEdit
        );

        const studyPlanItemsTimes: StudyPlanItemStructureTime[] = [];

        await asyncForEach(
            createNumberArrayWithLength(randomTotalElementsToEdit),
            async (_, index) => {
                const times = generateStudyplanTimeAndConvertToStringInput(
                    startTimeTestCase === 'none' ? 'random' : `startTime ${startTimeTestCase}`
                );
                const { availableFrom, availableTo, startDate } = times;

                if (index === 0) {
                    await schoolAdminFocusToTheFirstInputOfStudyPlanItem(
                        this.cms,
                        randomIndexStartEdit
                    );
                }

                await this.cms.instruction(`School admin copies ${availableFrom}`, async () => {
                    await schoolAdminFakeCopyValueInputStudyPlanTime(this.cms, availableFrom);
                });

                await this.cms.instruction(
                    'School admin pastes value into available from time input',
                    async () => {
                        await this.cms.page?.keyboard.press('Control+v');
                    }
                );

                await this.cms.instruction(`School admin tabs to the next input`, async () => {
                    await this.cms.page?.keyboard.press('Tab');
                });

                await this.cms.instruction(`School admin copies ${availableTo}`, async () => {
                    await schoolAdminFakeCopyValueInputStudyPlanTime(this.cms, availableTo);
                });

                await this.cms.instruction(
                    'School admin pastes value into available to time input',
                    async () => {
                        await this.cms.page?.keyboard.press('Control+v');
                    }
                );

                await this.cms.instruction(`School admin tabs to the next input`, async () => {
                    await this.cms.page?.keyboard.press('Tab');
                });

                if (startTimeTestCase !== 'none') {
                    await this.cms.instruction(`School admin copies ${startDate}`, async () => {
                        await schoolAdminFakeCopyValueInputStudyPlanTime(this.cms, startDate);
                    });

                    await this.cms.instruction(
                        `School admin pastes value into start time input`,
                        async () => {
                            await this.cms.page?.keyboard.press('Control+v');
                        }
                    );
                }

                await this.cms.instruction(`School admin tabs to the next input`, async () => {
                    await this.cms.page?.keyboard.press('Tab');
                });

                await this.cms.instruction(`School admin sees due date auto filled`, async () => {
                    console.log('Avoid empty block');
                });

                if (index < randomTotalElementsToEdit - 1) {
                    await this.cms.instruction(
                        `School admin tabs to jump to the next study plan item`,
                        async () => {
                            await this.cms.page?.keyboard.press('Tab');
                        }
                    );
                }

                studyPlanItemsTimes.push(times);
            }
        );

        this.scenario.set(aliasStudyPlanItemsTimes, studyPlanItemsTimes);
        this.scenario.set(aliasRandomIndexStartEditStudyPlanItems, randomIndexStartEdit);

        await this.cms.instruction(`User saving study plan items after edited`, async () => {
            await schoolAdminBulkActionStudyPlanItems(this.cms, 'save');
            await schoolAdminWaitingUpdateStudyPlanItems(this.cms);
        });

        await schoolAdminWaitingUpdateStudyPlanItems(this.cms);
    }
);

Then(
    'school admin sees study plan items updated with due date {string}',
    async function (endDateResult: 'equal to availableTime' | 'from startTime 7 days' | 'none') {
        const studyPlanItemsTimes =
            this.scenario.get<Required<StudyPlanItemStructureTime>[]>(aliasStudyPlanItemsTimes);

        const isNoneTestCase = endDateResult === 'none';

        const indexStartEdit = this.scenario.get<number>(aliasRandomIndexStartEditStudyPlanItems);

        await asyncForEach(studyPlanItemsTimes, async (studyPlanItemTimes, index) => {
            const { availableFrom, availableTo, startDate } = studyPlanItemTimes;

            const endDate = new Date(
                endDateResult === 'equal to availableTime' ? availableTo : startDate
            );

            if (endDateResult === 'from startTime 7 days') {
                endDate.setDate(endDate.getDate() + 7);
                if (endDate.getDate() !== new Date(availableTo).getDate()) {
                    endDate.setHours(23);
                    endDate.setMinutes(59);
                }
            }

            const tableRowIndex = indexStartEdit + index;

            const availableToDisplay = convertStudyPlanItemTimeToUI(availableTo);
            const availableFromDisplay = convertStudyPlanItemTimeToUI(availableFrom);
            const startDateDisplay = isNoneTestCase
                ? '--'
                : convertStudyPlanItemTimeToUI(startDate);

            const endDateDisplay = isNoneTestCase
                ? '--'
                : convertStudyPlanItemTimeToUI(endDate.toISOString());

            const instruction = `User will see study plan item at index ${tableRowIndex} will show
                availableFrom ${availableFromDisplay},
                availableTo ${availableToDisplay},
                startDate ${startDateDisplay},
                endDate ${endDateDisplay}`;

            await this.cms.instruction(instruction, async () => {
                await schoolAdminSeeValueInTheStudyPlanItemCell(
                    this.cms,
                    'availableFrom',
                    tableRowIndex,
                    availableFromDisplay
                );
                await schoolAdminSeeValueInTheStudyPlanItemCell(
                    this.cms,
                    'availableTo',
                    tableRowIndex,
                    availableToDisplay
                );
                await schoolAdminSeeValueInTheStudyPlanItemCell(
                    this.cms,
                    'startDate',
                    tableRowIndex,
                    startDateDisplay
                );
                await schoolAdminSeeValueInTheStudyPlanItemCell(
                    this.cms,
                    'endDate',
                    tableRowIndex,
                    endDateDisplay
                );
            });
        });
    }
);

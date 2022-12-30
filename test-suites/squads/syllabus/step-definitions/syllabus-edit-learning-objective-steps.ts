import { LOPlace } from '@legacy-step-definitions/types/common';
import { genId, getRandomElement } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld, LOType } from '@supports/app-types';
import { ActionOptions } from '@supports/types/cms-types';

import {
    aliasCourseId,
    aliasCourseName,
    aliasLOName,
    aliasLONameSelected,
    aliasLOPlace,
    aliasLOSelected,
    aliasLOTypeSelected,
    aliasLOVideoId,
    aliasRandomExam,
    aliasRandomLearningObjectives,
    aliasTopicName,
} from './alias-keys/syllabus';
import { dialogWithHeaderFooter, loAndAssignmentByName } from './cms-selectors/cms-keys';
import { teacherWaitingForStudyPlanListVisible } from './create-course-studyplan-definitions';
import { schoolAdminGoesToLODetailsPage } from './syllabus-create-question-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import {
    schoolAdminClickLOsItemOption,
    schoolAdminClickOptionOnHeader,
} from './syllabus-delete-learning-objective-definitions';
import {
    schoolAdminCheckEditLOIsLegacy,
    schoolAdminFindLOByType,
    schoolAdminSeeBrightcoveVideoInLO,
    schoolAdminSeeStudyGuideInLO,
    schoolAdminSeesUpdatedLoInfo,
    schoolAdminSelectEditLO,
    schoolAdminUpdateLOName,
    schoolAdminUploadLOStudyGuide,
    schoolAdminUploadLOVideoFile,
    schoolAdminUploadLOVideoLink,
    studentSeesUpdatedLoInfo,
    teacherSeesUpdatedLoInfo,
} from './syllabus-edit-learning-objective-definitions';
import { schoolAdminFillLOFormData } from './syllabus-learning-objectives-create-definitions';
import { teacherGoesToStudyPlanDetails } from './syllabus-study-plan-upsert-definitions';
import {
    schoolAdminSeeLOsItemInBook,
    schoolAdminSeesErrorMessageField,
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
} from './syllabus-utils';
import { schoolAdminClickLOByName } from './syllabus-view-task-assignment-definitions';
import { LearningObjective } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';
import { convertOneOfStringTypeToArray } from 'test-suites/squads/syllabus/utils/common';

export type LoInfo = 'name' | 'video' | 'pdf' | 'brightcove video';

When(`school admin edits LO {string}`, async function (loInfo: LoInfo) {
    const loName = this.scenario.get(aliasLOName);

    await this.cms.instruction(`school admin goes to LO details`, async () => {
        await schoolAdminGoesToLODetailsPage(this.cms, loName);
    });

    await this.cms.instruction(`school admin updates the ${loInfo} of the LO`, async () => {
        switch (loInfo) {
            case 'name':
                await this.cms.instruction(`school admin selects to edit the LO name`, async () => {
                    await schoolAdminSelectEditLO(this.cms, loName);
                });
                await this.cms.instruction(
                    `school admin inputs new LO name and save to update`,
                    async () => {
                        const { loName: loUpdatedName } = await schoolAdminUpdateLOName(
                            this.cms,
                            loName
                        );
                        this.scenario.set(aliasLOName, loUpdatedName);
                    }
                );
                break;
            case 'video': {
                await this.cms.instruction(
                    `school admin adds video file to LO by uploading file`,
                    async () => {
                        const { videoId } = await schoolAdminUploadLOVideoFile(this.cms);
                        this.scenario.set(aliasLOVideoId, videoId);
                    }
                );
                break;
            }
            case 'brightcove video':
                await this.cms.instruction(
                    `school admin adds video file to LO by brightcove link`,
                    async () => {
                        await schoolAdminUploadLOVideoLink(this.cms);
                    }
                );
                break;
            case 'pdf':
                await this.cms.instruction(
                    `school admin uploads pdf study guide to LO`,
                    async () => {
                        await schoolAdminUploadLOStudyGuide(this.cms);
                    }
                );
                break;
        }
    });
});

Then(`school admin sees the edited LO {string} on CMS`, async function (loInfo: LoInfo) {
    await this.cms.instruction(`school admin sees the LO with updated ${loInfo}`, async () => {
        await schoolAdminSeesUpdatedLoInfo(this.cms, this.scenario, loInfo);
    });
});

Then(`student sees the edited LO {string} on Learner App`, async function (loInfo: LoInfo) {
    await this.learner.instruction(
        `student refreshes course list and go to course details page`,
        async () => {
            const courseName = this.scenario.get(aliasCourseName);
            await studentRefreshHomeScreen(this.learner);
            await studentGoToCourseDetail(this.learner, courseName);
        }
    );

    await this.learner.instruction(`student goes to the topic details of the LO`, async () => {
        const topicName = this.scenario.get(aliasTopicName);
        await studentGoToTopicDetail(this.learner, topicName);
    });

    await this.learner.instruction(`student sees the LO with the update ${loInfo}`, async () => {
        await studentSeesUpdatedLoInfo(this.learner, this.scenario, loInfo);
    });
});

Then(`teacher sees the edited LO {string} on Teacher App`, async function (loInfo: LoInfo) {
    const courseName = this.scenario.get(aliasCourseName);
    const courseId = this.scenario.get(aliasCourseId);
    const studentId = await this.learner.getUserId();

    await this.teacher.instruction(
        `teacher goes to course ${courseName} student tab from home page`,
        async () => {
            await teacherGoesToStudyPlanDetails(this.teacher, courseId, studentId);
            await teacherWaitingForStudyPlanListVisible(this.teacher);
        }
    );

    await this.teacher.instruction(`teacher sees the LO with the update ${loInfo}`, async () => {
        await teacherSeesUpdatedLoInfo(this.teacher, this.scenario, loInfo);
    });
});

When(
    'school admin selects a LO {string} in {string} to edit',
    async function (this: IMasterWorld, loType: LOType, place: LOPlace) {
        const loList = this.scenario.get<LearningObjective[]>(aliasRandomLearningObjectives);

        const list = convertOneOfStringTypeToArray<LOType>(loType);
        const type = getRandomElement<LOType>(list);
        const {
            info: { name: loName },
        } = schoolAdminFindLOByType(loList, type);

        this.scenario.set(aliasLOTypeSelected, type);
        this.scenario.set(aliasLOPlace, place);
        this.scenario.set(aliasLONameSelected, loName);

        await this.cms.instruction(`school admin will select ${loName} to delete`, async () => {
            await this.cms.page?.waitForSelector(loAndAssignmentByName(loName));
        });

        if (place === 'book') {
            await this.cms.instruction('school admin select rename option', async () => {
                await schoolAdminClickLOsItemOption(this.cms, loName, ActionOptions.RENAME);
            });

            return;
        }

        await this.cms.instruction(`school admin go to ${loName} detail page`, async () => {
            await schoolAdminClickLOByName(this.cms, loName);
            await this.cms.waitingForLoadingIcon();
        });

        await this.cms.instruction('school admin select edit option', async () => {
            await schoolAdminClickOptionOnHeader(this.cms, ActionOptions.EDIT);
        });
    }
);

Then('school admin edits LO', async function (this: IMasterWorld) {
    const loType = this.scenario.get<LOType>(aliasLOTypeSelected);
    const place = this.scenario.get<LOPlace>(aliasLOPlace);
    const isLegacyUI = schoolAdminCheckEditLOIsLegacy(loType, place);

    const name = `${loType} edit ${genId()}`;

    await this.cms.instruction(`school admin edit LO in the ${place}`, async () => {
        await schoolAdminFillLOFormData(this.cms, name, isLegacyUI);
    });

    await this.cms.confirmDialogAction();

    this.scenario.set(aliasLOName, name);
});

Then(
    'school admin sees the edited LO in {string}',
    async function (this: IMasterWorld, place: LOPlace) {
        const name = this.scenario.get(aliasLOName);

        if (place === 'detail') {
            await this.cms.assertThePageTitle(name);
            return;
        }

        await this.cms.instruction(`school admin will see LO ${name} in the book`, async () => {
            await schoolAdminSeeLOsItemInBook(this.cms, name);
        });
    }
);

Given(
    'school admin goes to the LO {string} detail page',
    async function (this: IMasterWorld, type: LOType) {
        let loList: LearningObjective[] = [];

        if (type === 'exam LO') {
            loList = this.scenario.get<LearningObjective[]>(aliasRandomExam);

            if (!loList) {
                loList = this.scenario.get<LearningObjective[]>(aliasRandomLearningObjectives);
            }
        } else loList = this.scenario.get<LearningObjective[]>(aliasRandomLearningObjectives);

        const selectedLO = schoolAdminFindLOByType(loList, type);

        await this.cms.instruction(
            `school admin click to LO ${selectedLO.info.name} in book`,
            async () => {
                await schoolAdminClickLOByName(this.cms, selectedLO.info.name);
            }
        );

        await this.cms.instruction(
            `school admin at ${selectedLO.info.name} detail page`,
            async () => {
                await this.cms.waitingForLoadingIcon();
                await this.cms.waitForSkeletonLoading();
            }
        );

        this.scenario.set(aliasLOSelected, selectedLO);
    }
);

When('school admin upload {string} in LO', async function (this: IMasterWorld, material: LoInfo) {
    await this.cms.instruction(`school admin will upload ${material}`, async () => {
        switch (material) {
            case 'video':
                await schoolAdminUploadLOVideoFile(this.cms);
                break;
            case 'brightcove video':
                return schoolAdminUploadLOVideoLink(this.cms);
            case 'pdf':
                return schoolAdminUploadLOStudyGuide(this.cms);
            default:
                throw new Error(`Please handle upload ${material} in the LO`);
        }
    });
});

Then(
    'school admin sees the {string} uploaded in LO {string}',
    async function (this: IMasterWorld, material: LoInfo, loType: LOType) {
        await this.cms.instruction(
            `school admin will see ${material} uploaded in ${loType}`,
            async () => {
                switch (material) {
                    case 'pdf': {
                        await schoolAdminSeeStudyGuideInLO(this.cms);
                        return;
                    }
                    case 'brightcove video': {
                        await schoolAdminSeeBrightcoveVideoInLO(this.cms);
                        return;
                    }
                    case 'video': {
                        // Current UX of uploading LO video file can not check by UI
                        return;
                    }
                    default:
                        throw new Error(`Please handle expect upload ${material} in the LO`);
                }
            }
        );
    }
);

Then('school admin edits LO with missing {string}', async function (this: IMasterWorld, _: string) {
    const loType = this.scenario.get<LOType>(aliasLOTypeSelected);
    const place = this.scenario.get<LOPlace>(aliasLOPlace);

    const isLegacyUI = schoolAdminCheckEditLOIsLegacy(loType, place);

    await this.cms.instruction(`school admin fill '' in to LO name at ${place}`, async () => {
        await schoolAdminFillLOFormData(this.cms, '', isLegacyUI);
    });

    await this.cms.confirmDialogAction();
});

Then('school admin cannot edit LO', async function (this: IMasterWorld) {
    const loType = this.scenario.get<LOType>(aliasLOTypeSelected);

    const place = this.scenario.get<LOPlace>(aliasLOPlace);

    const isLegacyUI = schoolAdminCheckEditLOIsLegacy(loType, place);

    if (isLegacyUI) {
        await this.cms.assertNotification('The form is not valid. Please check for errors');
        return;
    }

    await this.cms.instruction(
        `school admin still sees edit LO ${loType} dialog with error message`,
        async () => {
            await schoolAdminSeesErrorMessageField(this.cms, {
                wrapper: dialogWithHeaderFooter,
            });
        }
    );
});

When(
    'school admin sees message edit LO {string} success',
    async function (this: IMasterWorld, _: string) {
        const loType = this.scenario.get<LOType>(aliasLOTypeSelected);

        const place = this.scenario.get<LOPlace>(aliasLOPlace);

        if (place === 'book') {
            await this.cms.assertNotification('You have updated learning objective successfully');
            return;
        }

        const mapperMsg: { [key in LOType]?: string } = {
            'exam LO': 'learning objective',
            'learning objective': 'learning objective',
            flashcard: 'flash card',
        };

        await this.cms.assertNotification(`You have updated ${mapperMsg[loType]} successfully`);
    }
);

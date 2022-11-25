import { genId } from '@legacy-step-definitions/utils';

import { CMSInterface, LOType } from '@supports/app-types';
import { samplePdfUrl } from '@supports/constants';
import { ScenarioContext } from '@supports/scenario-context';
import NsBobCourseModifierServiceRequest from '@supports/services/bob-course-modifier/request-types';
import {
    KeyAssignmentType,
    KeyLearningObjectiveType,
    LearningObjectiveType,
} from '@supports/services/bob-course/const';
import { ILearningMaterialBase } from '@supports/services/common/learning-material';
import { learningObjectiveModifierService } from '@supports/services/eureka/learning-objective';

import {
    aliasLOName,
    aliasRandomAssignment,
    aliasRandomLearningObjective,
    aliasRandomTaskAssignment,
    aliasTopicName,
} from './alias-keys/syllabus';
import { createLoButton, formInput, topicItem } from './cms-selectors/cms-keys';
import { loInputSelector } from './cms-selectors/learning-objective';
import {
    createRandomExamLO,
    createRandomFlashcard,
    createRandomLearningObjective,
} from './create-data-book-content-utils';
import { createRandomAssignments } from './syllabus-content-book-create-definitions';
import { schoolAdminShouldUseInsertLO } from './syllabus-migration-temp';
import { getLOTypeValue } from './syllabus-utils';
import { Int32Value } from 'manabuf/google/protobuf/wrappers_pb';
import {
    Assignment,
    LearningObjective,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export async function schoolAdminCreateALO(
    cms: CMSInterface,
    context: ScenarioContext,
    loType: LOType,
    loName?: string,
    topicName?: string
): Promise<void> {
    const { loTypeTitle } = getLOTypeValue({ loType });

    if (loName === undefined) {
        loName = `${loTypeTitle} ${genId()}`;
    }

    if (topicName === undefined) {
        topicName = context.get<string>(aliasTopicName);
    }

    const createLOButton = await cms
        .page!.waitForSelector(topicItem(topicName))
        .then((chapterRow) => chapterRow.waitForSelector(createLoButton));

    await createLOButton.click();
    await schoolAdminFillLOData(cms, loName, loType);
    context.set(aliasLOName, loName);
}

export const schoolAdminFillLOFormData = async (
    cms: CMSInterface,
    name: string,
    isLegacyUI?: boolean
) => {
    if (isLegacyUI) {
        await cms.page!.fill(loInputSelector, name);
        return;
    }
    await cms.page?.fill(formInput, name);
};

export async function schoolAdminFillLOData(cms: CMSInterface, loName: string, loType: LOType) {
    await cms.selectElementByDataTestId(`SelectHF__select`);
    const { loTypeKey } = await getLOTypeValue({ loType });

    await cms.instruction(
        `School admin fill data to create a LO name = ${loName}`,
        async function (this: CMSInterface) {
            const cms = this.page!;

            await cms.click(`[data-value="${loTypeKey}"]`);

            if (loType !== 'assignment' && loType !== 'task assignment') {
                await cms.fill(formInput, loName);
            }
        }
    );

    await cms.selectAButtonByAriaLabel(`Confirm`);

    if (loType !== 'assignment' && loType !== 'task assignment') {
        await cms.assertThePageTitle(`${loName}`);
    } else {
        await schoolAdminFillAssignmentData(cms, loName, loType);
    }
}

export async function schoolAdminFillAssignmentData(
    cms: CMSInterface,
    assignmentName: string,
    loType: LOType
): Promise<void> {
    const isAssignment = loType === 'assignment';

    await cms.instruction(
        `School admin fill data to create ${loType} ${assignmentName}`,
        async function () {
            const page = cms.page!;
            await page.fill(`#name`, assignmentName);
            if (isAssignment) {
                await page.fill(`#max_grade`, `100`);
            }
            await cms.waitingForProgressBar();
            await cms.selectAButtonByAriaLabel(`Save`);
            await cms.waitingForProgressBar();
        }
    );
}

export type CreateRandomLearningObjectivesReturnType = Promise<{
    request: { learningObjectivesList: (ILearningMaterialBase & LearningObjective)[] };
}>;

export async function createRandomLearningObjectives(
    cms: CMSInterface,
    {
        quantity = 1,
        topicId,
        type = KeyLearningObjectiveType.LEARNING_OBJECTIVE_TYPE_LEARNING,
        displayOrderFrom = 1,
        shouldHaveMaterial = false,
        timeLimit = undefined,
    }: {
        quantity?: number;
        topicId: string;
        type?: keyof typeof KeyLearningObjectiveType;
        displayOrderFrom?: number;
        shouldHaveMaterial?: boolean;
        timeLimit?: number;
    }
): CreateRandomLearningObjectivesReturnType {
    if (quantity < 1) throw new Error("Can't create learning objectives with quantity less than 1");

    const { loTypeTitle } = getLOTypeValue({ loTypeKey: type });
    const [token, { schoolId }] = await Promise.all([cms.getToken(), cms.getContentBasic()]);
    const learningObjectives = [...Array(quantity)].map((_, index) => {
        const id = genId();
        const name = `${loTypeTitle} ${id}`;

        const item: NsBobCourseModifierServiceRequest.UpsertLearningObjectives = {
            info: {
                id,
                name,
                schoolId,
                displayOrder: displayOrderFrom + index,
            },
            video: '',
            studyGuide: shouldHaveMaterial ? samplePdfUrl : '',
            type: LearningObjectiveType[type],
            topicId,
            quizIdsList: [],
            prerequisitesList: [],
            instruction: '',
            manualGrading: false,
            gradeToPass: '',
        };

        if (timeLimit) {
            const timeLimitIns = new Int32Value();
            timeLimitIns.setValue(timeLimit);
            item.timeLimit = timeLimitIns;
        }
        return item;
    });

    const shouldEnableUseInsertLO = await schoolAdminShouldUseInsertLO();
    if (shouldEnableUseInsertLO && type === 'LEARNING_OBJECTIVE_TYPE_LEARNING') {
        const learningObjectives = await createRandomLearningObjective(
            cms,
            {
                topicId,
                studyGuide: shouldHaveMaterial ? samplePdfUrl : '',
            },
            {
                quantity,
            }
        );

        return {
            request: {
                learningObjectivesList: learningObjectives,
            },
        };
    }

    // TODO: Hieu will update shouldEnableUseInsertLO later
    if (shouldEnableUseInsertLO && type === 'LEARNING_OBJECTIVE_TYPE_EXAM_LO') {
        const examLOs = await createRandomExamLO(
            cms,
            {
                topicId,
                timeLimit,
            },
            {
                quantity,
            }
        );

        return {
            request: {
                learningObjectivesList: examLOs,
            },
        };
    }

    // TODO: Hieu will update shouldEnableUseInsertLO later
    if (shouldEnableUseInsertLO && type === 'LEARNING_OBJECTIVE_TYPE_FLASH_CARD') {
        const flashcards = await createRandomFlashcard(
            cms,
            {
                topicId,
            },
            {
                quantity,
            }
        );

        return {
            request: {
                learningObjectivesList: flashcards,
            },
        };
    }

    const { request } = await learningObjectiveModifierService.upsertLearningObjectives(
        token,
        learningObjectives
    );

    return {
        request: {
            learningObjectivesList: request.learningObjectivesList.map((learningObjective) => {
                const { id, displayOrder, name } = learningObjective.info!;

                const learningMaterial: ILearningMaterialBase = {
                    learningMaterialId: id,
                    name: learningObjective.info!.name,
                    topicId: learningObjective.topicId,
                    // TODO: Hard code because we don't use it for now
                    typeForLM: 'LEARNING_MATERIAL_LEARNING_OBJECTIVE',
                };
                return {
                    ...learningMaterial,
                    ...learningObjective,
                    info: {
                        id: id,
                        name: name,
                        displayOrder,
                    },
                };
            }),
        },
    };
}

export async function createRandomLOInTopic(
    cms: CMSInterface,
    {
        topicId,
        loType,
        quantity = 1,
        displayOrderFrom = 1,
    }: { topicId: string; loType: LOType; quantity?: number; displayOrderFrom?: number }
): Promise<{
    losInTopic: LearningObjective[];
    assignmentsInTopic: Assignment[];
    taskAssignmentsInTopic: Assignment[];
}> {
    let losInTopic: LearningObjective[] = [];
    let assignmentsInTopic: Assignment[] = [];
    let taskAssignmentsInTopic: Assignment[] = [];

    if (loType === 'assignment') {
        const {
            request: { assignmentsList: assignments },
        } = await createRandomAssignments(cms, {
            quantity,
            topicId: topicId,
            displayOrderFrom,
        });

        assignmentsInTopic = [...assignments];
    } else if (loType === 'task assignment') {
        const {
            request: { assignmentsList: taskAssignments },
        } = await createRandomAssignments(cms, {
            quantity,
            topicId,
            displayOrderFrom,
            type: KeyAssignmentType.ASSIGNMENT_TYPE_TASK,
            maxGrade: 0,
        });

        taskAssignmentsInTopic = [...taskAssignments];
    } else {
        const { loTypeKey } = getLOTypeValue({ loType });
        const type = loTypeKey as keyof typeof KeyLearningObjectiveType;

        const {
            request: { learningObjectivesList },
        } = await createRandomLearningObjectives(cms, {
            quantity,
            topicId: topicId,
            type,
            displayOrderFrom,
        });

        losInTopic = learningObjectivesList as unknown as LearningObjective[];
    }

    return { losInTopic, assignmentsInTopic, taskAssignmentsInTopic };
}

export function getNameByLoType(scenario: ScenarioContext, loType: LOType) {
    const lo = scenario.get<LearningObjective>(aliasRandomLearningObjective);
    const assignment = scenario.get<Assignment>(aliasRandomAssignment);
    const taskAssignment = scenario.get<Assignment>(aliasRandomTaskAssignment);
    let name: string;

    switch (loType) {
        case 'assignment':
            name = assignment.name;
            break;

        case 'task assignment':
            name = taskAssignment.name;
            break;

        default:
            name = lo.info.name;
            break;
    }

    return name;
}

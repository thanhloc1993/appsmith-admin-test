import { randomBoolean, toShortenStr } from '@legacy-step-definitions/utils';
import { dialogWithHeaderFooterWrapper } from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';
import { ILearningMaterialBase } from '@supports/services/common/learning-material';
import { StudyPlanItemObject } from '@supports/services/eureka-study_plan_modifier-service/types';
import { SelectDatePickerParams } from '@supports/types/cms-types';

import { breadcrumb } from './cms-selectors/cms-keys';
import { datePickerInput } from './cms-selectors/syllabus';
import { generateStudyplanTime, StudyPlanTestCase } from './syllabus-book-csv';
import {
    schoolAdminIsAtStudyPlanDetailsPage,
    StudyPlanPageType,
} from './syllabus-study-plan-common-definitions';
import { schoolAdminChooseTabInCourseDetail } from 'test-suites/common/step-definitions/course-definitions';
import { StudyPlanItemStructure } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export const modifyStudyPlanItems = <T>(studyPlanItems: T[], testCase: StudyPlanTestCase): T[] => {
    let testCaseSafe: StudyPlanTestCase = testCase;
    return studyPlanItems.map((item) => {
        if (testCase === 'random') {
            testCaseSafe = randomBoolean() ? 'available' : 'unavailable';
        }

        const { availableFrom, availableTo, startDate, endDate } =
            generateStudyplanTime(testCaseSafe);

        return {
            ...item,
            availableFrom,
            availableTo,
            startDate,
            endDate,
        };
    });
};

export const mapStudyPlanItemWithInfo = (
    studyPlanItems: StudyPlanItemObject[],
    lOAndAssignments: ILearningMaterialBase[]
) => {
    const findLOOrAssignment = (id: string) => {
        const lOOrAssignment = lOAndAssignments.find((item) => {
            return item.learningMaterialId === id;
        });
        return lOOrAssignment;
    };

    const data: StudyPlanItemStructure[] = studyPlanItems.map((studyPlanItem) => {
        const {
            contentStructure,
            studyPlanId,
            studyPlanItemId,
            status,
            availableFrom,
            availableTo,
            startDate,
            endDate,
        } = studyPlanItem;
        if (!contentStructure) throw new Error('contentStructure is required in study plan item');

        const { loId, assignmentId } = contentStructure;
        const id = loId || assignmentId;

        if (!id) throw new Error('lOId or assignmentId is required');

        const lOOrAssignment = findLOOrAssignment(id);
        if (!lOOrAssignment) throw new Error('Cannot find LO or Assignment');

        const { name } = lOOrAssignment;

        const studyPlanItemDraft: StudyPlanItemStructure = {
            studyPlanId,
            contentId: id,
            name,
            studyPlanItemId,
            status,
            availableFrom,
            availableTo,
            startDate,
            endDate,
        };

        return studyPlanItemDraft;
    });

    return data;
};

export const schoolAdminWaitingUpdateStudyPlanItems = async (cms: CMSInterface) => {
    await cms.page?.waitForSelector(dialogWithHeaderFooterWrapper, {
        state: 'detached',
    });

    await cms.waitForSkeletonLoading();
};

export const schoolAdminBulkActionStudyPlanItems = async (
    cms: CMSInterface,
    type: 'save' | 'cancel',
    shouldCancelConfirm = false
) => {
    await cms.selectAButtonByAriaLabel(type === 'save' ? 'Save' : 'Cancel');

    if (shouldCancelConfirm) {
        await cms.cancelDialogAction();
    } else {
        await cms.confirmDialogAction();
    }

    await schoolAdminWaitingUpdateStudyPlanItems(cms);
};

export const getDatePickerParams = (selectedDate: Date): SelectDatePickerParams => {
    const monthDiff = selectedDate.getMonth() - new Date().getMonth();

    return {
        day: selectedDate.getDate(),
        monthDiff,
        datePickerSelector: datePickerInput,
    };
};

export const getFirstStudyPlanItemFields = (cms: CMSInterface) =>
    cms.page!.$$("tbody tr:first-child input[type='text']");

export const getStudyPlanItemFieldsByName = (cms: CMSInterface, studyPlanItemName: string) =>
    cms.page!.$$(`tbody tr:has-text('${studyPlanItemName}') input[type='text']`);

export const getFirstStudyPlanItemValues = (cms: CMSInterface) =>
    cms.page!.$$eval(
        "tbody tr:first-child [data-testid='StudyPlanItem__dateDisplay']",
        (elements) => elements.map((element) => element.textContent!.trim())
    );

export const goToStudyPlanDetailsFromBreadcrumb = async (
    cms: CMSInterface,
    courseName: string,
    studyPlanName: string,
    studyPlanType: StudyPlanPageType
) => {
    await (await cms.waitForSelectorHasText(`${breadcrumb} a`, toShortenStr(courseName)))?.click();
    await schoolAdminChooseTabInCourseDetail(cms, 'studyPlan');
    await schoolAdminIsAtStudyPlanDetailsPage(cms, studyPlanName, studyPlanType);
};

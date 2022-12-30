import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { ElementHandle } from 'playwright';

import { CMSInterface, LearnerInterface } from '@supports/app-types';
import { ActionOptions } from '@supports/types/cms-types';

import {
    formInput,
    loAndAssignmentByName,
    saveButton,
    studyPlanBulkEditTable,
    tableBaseRow,
} from './cms-selectors/cms-keys';
import {
    studyPlanItemAvailableFromCell,
    studyPlanItemAvailableUtilCell,
    studyPlanItemEndDateCell,
    studyPlanItemStartDateCell,
} from './cms-selectors/study-plan';
import { ByValueKey } from 'flutter-driver-x';
import moment, { now } from 'moment-timezone';
import { cmsExamForm } from 'test-suites/squads/syllabus/cms-locators/exam-form';

export async function learnerVerifyExamLOInstruction(
    learner: LearnerInterface,
    instruction: string,
    numOfQuestions: number
) {
    const driver = learner.flutterDriver!;

    await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.totalQuestions(numOfQuestions)));
    await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.examLOInstruction(instruction)));
}

export async function cmsUpdateAvailableTimeForExamLO(cms: CMSInterface) {
    const page = cms.page!;

    await cms.selectAButtonByAriaLabel('Edit');

    const studyPlanItemEditTable = await page.waitForSelector(studyPlanBulkEditTable);

    const availableFrom = moment(now()).format('YYYY/MM/DD');
    const until = moment(now()).add(1, 'days').format('YYYY/MM/DD');

    const allStudyPlanItems = await studyPlanItemEditTable.$$(tableBaseRow);

    for (const studyPlanItem of allStudyPlanItems) {
        await fillAvailableTimeForSPItem(
            studyPlanItem,
            studyPlanItemAvailableFromCell,
            availableFrom
        );

        await fillAvailableTimeForSPItem(studyPlanItem, studyPlanItemAvailableUtilCell, until);

        await fillAvailableTimeForSPItem(studyPlanItem, studyPlanItemStartDateCell, availableFrom);

        await fillAvailableTimeForSPItem(studyPlanItem, studyPlanItemEndDateCell, until);
    }

    await cms.selectAButtonByAriaLabel('Save');

    const confirmSaveButton = await page.waitForSelector(saveButton);
    await confirmSaveButton.click();

    await cms.assertNotification('You have updated study plan content successfully');
}

async function fillAvailableTimeForSPItem(
    element: ElementHandle<SVGElement | HTMLElement>,
    selector: string,
    input: string
) {
    const availableFromField = await element.waitForSelector(selector);
    const inputField = await availableFromField.waitForSelector(formInput);
    await inputField.fill(input);
}

export async function schoolAdminGoToLOItemDetail(cms: CMSInterface, loName: string) {
    const page = cms.page!;
    const loItem = await page.waitForSelector(loAndAssignmentByName(loName));
    await loItem.click();
}

export async function schoolAdminUpdateExamLOInstruction(cms: CMSInterface, newValue: string) {
    const page = cms.page!;

    await cms.selectActionButton(ActionOptions.EDIT, { target: 'actionPanelTrigger' });

    await cmsExamForm.waitForInstruction(page);
    await cmsExamForm.fillInstruction(page, newValue);

    await cms.selectAButtonByAriaLabel(`Save`);
}

import { AccountAction, CMSInterface } from '@supports/app-types';

import * as CommunicationSelectors from './cms-selectors/communication';
import {
    fillCourseOnDialog,
    fillIndividualRecipientOnDialog,
} from './communication-common-definitions';

export async function searchStudentAtAutoCompleteIndividualRecipient(
    cms: CMSInterface,
    name: string
) {
    await cms.waitingAutocompleteLoading(CommunicationSelectors.studentsAutocompleteInput);

    await fillIndividualRecipientOnDialog(cms, name);
}

export async function searchCourseOnComposeDialog(cms: CMSInterface, name: string) {
    await cms.waitingAutocompleteLoading(CommunicationSelectors.coursesAutocompleteInput);

    await fillCourseOnDialog(cms, name);
}

async function getNumberOfElementSearchByNameLearnerAndAttachValue(
    cms: CMSInterface,
    learnerName: string
) {
    const selectorByLearnerName = CommunicationSelectors.getTextFromListbox(learnerName);

    const learnerNameElements = await cms.page!.$$(selectorByLearnerName);
    const numberOfLearnerNameElements = learnerNameElements.length;

    await cms.attach(
        `When search student with the name as ${learnerName} at individual recipient.
Default student name and mail is the same, find by unique name in  individual recipient autocomplete's options: ${numberOfLearnerNameElements}`
    );

    return numberOfLearnerNameElements;
}

export async function verifyStudentAtAutocompleteIndividualRecipient(
    cms: CMSInterface,
    selectorByLearnerName: string,
    action: AccountAction
) {
    const numberOfLearnerNameElements = await getNumberOfElementSearchByNameLearnerAndAttachValue(
        cms,
        selectorByLearnerName
    );

    if (action === 'sees') {
        weExpect(numberOfLearnerNameElements).toBeGreaterThan(0);
    }
    if (action === 'does not see') {
        weExpect(numberOfLearnerNameElements).toEqual(0);
    }
}

async function getNumberOfElementSearchByNameCourseAndAttachValue(
    cms: CMSInterface,
    courseName: string
) {
    const selectorByCourseName = CommunicationSelectors.getTextFromListbox(courseName);
    const courseElement = await cms.page!.$(selectorByCourseName);

    await cms.attach(
        `Find ${courseElement} when search course with the name as ${courseName} on compose dialog`
    );

    return courseElement;
}

export async function verifyCourseAtCourseAutocomplete(
    cms: CMSInterface,
    courseName: string,
    action: AccountAction
) {
    const courseElement = await getNumberOfElementSearchByNameCourseAndAttachValue(cms, courseName);

    if (action === 'sees') {
        weExpect(courseElement).not.toBeNull();
    }
    if (action === 'does not see') {
        weExpect(courseElement).toBeNull();
    }
}

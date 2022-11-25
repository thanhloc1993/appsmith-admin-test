import { asyncForEach, gradesCMSMap } from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';
import { ActionOptions } from '@supports/types/cms-types';

import * as CMSKeys from './cms-selectors/cms-keys';
import { gradeAutoCompleteHFRoot } from './cms-selectors/cms-keys';
import * as StudyPlanKeys from './cms-selectors/study-plan';
import { schoolAdminCheckGradesAutocompleteEmpty } from './syllabus-utils';
import { StudyPlan } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export const schoolAdminChooseBookInStudyPlanForm = async (cms: CMSInterface, bookName: string) => {
    const cmsPage = cms.page!;

    await cmsPage.fill(CMSKeys.bookAutocompleteHFInput, bookName);

    await cms.waitingAutocompleteLoading(CMSKeys.bookAutocompleteHFRoot);
    await cms.chooseOptionInAutoCompleteBoxByText(bookName);
};

export const schoolAdminSeeDisabledBookInStudyPlanForm = async (
    cms: CMSInterface,
    bookName: string
) => {
    const cmsPage = cms.page!;
    const isDisabled = await cmsPage.isDisabled(CMSKeys.bookAutocompleteHFInput);

    weExpect(isDisabled).toEqual(true);

    await cms.waitingAutocompleteLoading(CMSKeys.bookAutocompleteHFRoot);

    const bookValue = await cms.page!.inputValue(CMSKeys.bookAutocompleteHFInput);
    weExpect(bookValue).toEqual(bookName);
};

export const schoolAdminFillStudyPlanNameInStudyPlanForm = async (
    cms: CMSInterface,
    studyPlanName: string
) => {
    await cms.page!.fill(StudyPlanKeys.studyPlanNameHFInput, '');
    await cms.page!.fill(StudyPlanKeys.studyPlanNameHFInput, studyPlanName);
};

export const schoolAdminChooseGradeInStudyPlanForm = async (
    cms: CMSInterface,
    grades: number[]
) => {
    const cmsPage = cms.page!;
    const isEmpty = await schoolAdminCheckGradesAutocompleteEmpty(cms, gradeAutoCompleteHFRoot);

    if (!isEmpty) {
        await schoolAdminClearAllGradesInStudyPlanForm(cms);
    }

    await cmsPage.click(CMSKeys.gradeAutoCompleteHFInput);

    await asyncForEach(grades, async (grade) => {
        const gradeOption = gradesCMSMap[grade as unknown as keyof typeof gradesCMSMap];

        await cms.chooseOptionInAutoCompleteBoxByText(gradeOption);
    });

    await cmsPage.click(CMSKeys.gradeAutoCompleteHFInput);
};

export const schoolAdminClearAllGradesInStudyPlanForm = async (cms: CMSInterface) => {
    const cmsPage = cms.page!;
    const isEmpty = await schoolAdminCheckGradesAutocompleteEmpty(cms, gradeAutoCompleteHFRoot);

    if (!isEmpty) {
        await cmsPage.hover(gradeAutoCompleteHFRoot);
        await cmsPage.click(`${gradeAutoCompleteHFRoot} button[aria-label='Clear']`);
    }
};

export const schoolAdminCheckTrackSchoolProgressInStudyPlanForm = async (
    cms: CMSInterface,
    trackSchoolProgress: boolean
) => {
    if (trackSchoolProgress) {
        return await cms.page!.check(StudyPlanKeys.trackSchoolProgressHFCheckbox);
    }
    await cms.page!.uncheck(StudyPlanKeys.trackSchoolProgressHFCheckbox);
};

export const schoolAdminFillStudyPlanForm = async (
    cms: CMSInterface,
    formData: StudyPlan,
    action: ActionOptions.ADD | ActionOptions.EDIT
) => {
    const { name, bookId, bookName, gradesList, trackSchoolProgress } = formData;

    if (bookId && bookName) {
        if (action === ActionOptions.ADD) {
            await schoolAdminChooseBookInStudyPlanForm(cms, bookName);
        } else {
            await schoolAdminSeeDisabledBookInStudyPlanForm(cms, bookName);
        }
    }

    await schoolAdminFillStudyPlanNameInStudyPlanForm(cms, name);

    if (gradesList.length) {
        await schoolAdminChooseGradeInStudyPlanForm(cms, gradesList);
    } else {
        await schoolAdminClearAllGradesInStudyPlanForm(cms);
    }

    await schoolAdminCheckTrackSchoolProgressInStudyPlanForm(cms, trackSchoolProgress);
};

import {
    dialogWithHeaderFooterWrapper,
    fileIconPDF,
    fileIconVideo,
    saveButton,
} from '@legacy-step-definitions/cms-selectors/cms-keys';
import {
    lessonDeleteOnlyThisLessonRadioButton,
    lessonDeleteThisAndFollowingRadioButton,
} from '@legacy-step-definitions/cms-selectors/lesson';
import { lessonInfoAttendanceStatusColumn } from '@legacy-step-definitions/cms-selectors/lesson-management';
import { makeSureLessonDetailHasNoMaterial } from '@legacy-step-definitions/lesson-school-admin-without-material-definitions';
import { goToDetailedLessonInfoPage } from '@legacy-step-definitions/lesson-teacher-submit-individual-lesson-report-definitions';
import { learnerProfileAlias } from '@user-common/alias-keys/user';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { schoolAdminSeeFileMediaChip } from 'test-suites/common/step-definitions/cms-common-definitions';
import { getUsersFromContextByRegexKeys } from 'test-suites/common/step-definitions/user-common-definitions';
import { aliasLessonTime } from 'test-suites/squads/lesson/common/alias-keys';
import { LessonStatusType, LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { assertLessonStatus } from 'test-suites/squads/lesson/step-definitions/auto-change-status-change-to-completed-when-submit-lesson-group-report-definitions';
import {
    LessonMaterialSingleType,
    saveUpdateLessonOfLessonManagement,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { assertFieldValueInPage } from 'test-suites/squads/lesson/step-definitions/lesson-remove-chip-filter-result-for-future-lesson-definitions';
import {
    filterLessonListByStudentName,
    OrderLessonInRecurringChain,
    selectLessonLinkByLessonOrder,
} from 'test-suites/squads/lesson/step-definitions/school-admin-edits-lesson-date-of-weekly-recurring-individual-lesson-definitions';
import { LessonActionSaveType } from 'test-suites/squads/lesson/types/lesson-management';
import { goToLessonsList } from 'test-suites/squads/lesson/utils/lesson-list';
import {
    assertOtherIndividualLessonInChainNoChanged,
    saveLessonWithStatus,
} from 'test-suites/squads/lesson/utils/lesson-upsert';

export type SavingLessonOptions = 'This and the following lessons' | 'Only this Lesson';

export async function selectAndSaveLessonSavingOption(
    cms: CMSInterface,
    method: SavingLessonOptions
) {
    await saveUpdateLessonOfLessonManagement(cms);
    const savingLessonOptionSelector =
        method === 'This and the following lessons'
            ? lessonDeleteThisAndFollowingRadioButton
            : lessonDeleteOnlyThisLessonRadioButton;

    await cms.selectElementWithinWrapper(dialogWithHeaderFooterWrapper, savingLessonOptionSelector);
    await cms.page!.click(saveButton);
}

export async function seeUpdatedAttendanceAndNotSeeMaterial(
    cms: CMSInterface,
    material: LessonMaterialSingleType
) {
    const page = cms.page!;
    await assertFieldValueInPage(page, lessonInfoAttendanceStatusColumn, 'Late');
    if (material === 'pdf') {
        await page.waitForSelector(fileIconPDF, { state: 'hidden' });
        // because we're using hard code to attach media
        await schoolAdminSeeFileMediaChip(cms, 'lesson-sample-video-1.mp4');
    } else {
        await page.waitForSelector(fileIconVideo, { state: 'hidden' });
        // because we're using hard code to attach media
        await schoolAdminSeeFileMediaChip(cms, 'sample-pdf.pdf');
    }
}

export async function assertOtherIndividualLessonsInChainNoChange(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    lessonStatus: LessonStatusType
) {
    const page = cms.page!;

    const users = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias);
    const lessonTime = scenarioContext.get<LessonTimeValueType>(aliasLessonTime);

    await goToLessonsList({ cms, lessonTime });
    await filterLessonListByStudentName(cms, users[0].name, lessonTime);
    await selectLessonLinkByLessonOrder(cms, OrderLessonInRecurringChain.FOURTH, lessonTime);

    await cms.waitingForLoadingIcon();
    await cms.waitForSkeletonLoading();

    await assertOtherIndividualLessonInChainNoChanged(cms, scenarioContext);

    // check Attendance
    await assertFieldValueInPage(page, lessonInfoAttendanceStatusColumn, '--');

    // check Material
    await makeSureLessonDetailHasNoMaterial(cms);

    // Check lesson status
    await assertLessonStatus(cms, lessonStatus);
}

export async function seeUpdatedAttendanceAndMaterial(
    cms: CMSInterface,
    material: LessonMaterialSingleType,
    fileName: string
) {
    const page = cms.page!;
    await assertFieldValueInPage(page, lessonInfoAttendanceStatusColumn, 'Late');
    if (material === 'pdf') {
        await page.waitForSelector(fileIconPDF, { state: 'visible' });
    } else {
        await page.waitForSelector(fileIconVideo, { state: 'visible' });
    }

    await schoolAdminSeeFileMediaChip(cms, fileName);
}

export async function goToEditLessonPage(cms: CMSInterface, lessonId: string) {
    await goToDetailedLessonInfoPage(cms, lessonId);
    await cms.selectAButtonByAriaLabel('Edit');
}

export async function selectAndSaveLessonSavingOptionWithStatus(params: {
    cms: CMSInterface;
    method: SavingLessonOptions;
    lessonActionSave: LessonActionSaveType;
}) {
    const { lessonActionSave, cms, method } = params;
    await saveLessonWithStatus(cms, lessonActionSave);

    const savingLessonOptionSelector =
        method === 'This and the following lessons'
            ? lessonDeleteThisAndFollowingRadioButton
            : lessonDeleteOnlyThisLessonRadioButton;

    await cms.selectElementWithinWrapper(dialogWithHeaderFooterWrapper, savingLessonOptionSelector);
    await cms.page!.click(saveButton);
}

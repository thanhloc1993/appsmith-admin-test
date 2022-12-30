import {
    actionPanelTriggerButton,
    buttonByAriaLabel,
} from '@legacy-step-definitions/cms-selectors/cms-keys';
import { uploadInput } from '@legacy-step-definitions/cms-selectors/course';
import { ClassCSV } from '@legacy-step-definitions/types/content';
import { withDownloadPath } from '@legacy-step-definitions/utils';
import { buttonSelectMasterDropdown } from '@user-common/cms-selectors/master-management';
import {
    dropdownValueItem,
    footerDialogConfirmButtonSave,
    dialogWithHeaderFooterWrapper,
    buttonImportMaster,
    buttonAction,
    studentCourseRowWithId,
} from '@user-common/cms-selectors/students-page';
import { chooseAutocompleteOptionByExactText } from '@user-common/utils/autocomplete-actions';
import { schoolAdminSeesMultipleSnackbar } from '@user-common/utils/check-messages';

import { CMSInterface, Classes } from '@supports/app-types';
import { Menu } from '@supports/enum';
import NsMasterCourseService from '@supports/services/master-course-service/request-types';

export async function createCSVListClass(
    cms: CMSInterface,
    course: NsMasterCourseService.UpsertCoursesRequest,
    classes: Classes[]
): Promise<ClassCSV[]> {
    const classRow: ClassCSV[] = [];
    const { locationIdsList = [] } = course;

    for (const locationId of locationIdsList) {
        for (const _class of classes) {
            const classData = createClassImport(course.id, locationId, _class);
            await cms.attach(`${_class} in file csv:${JSON.stringify(classData)}`);
            classRow.push(classData);
        }
    }
    return classRow;
}

export function createClassImport(courseId: string, locationId: string, className: string) {
    return {
        course_id: courseId,
        location_id: locationId,
        class_name: className,
    };
}

export async function schoolAdminGoesToImportClasses(cms: CMSInterface, fileName: string) {
    await cms.selectMenuItemInSidebarByAriaLabel(Menu.MASTER_MANAGEMENT);
    await schoolAdminImportFile(cms, 'class', fileName);
    await schoolAdminSeesMultipleSnackbar(
        cms,
        'successful',
        'The records are imported successfully!'
    );
    await cms.page?.reload();
}

export async function schoolAdminImportFile(cms: CMSInterface, type: string, fileName: string) {
    const page = cms.page!;

    await cms.instruction('School admin select import type', async function () {
        await page?.locator(buttonSelectMasterDropdown).click();
        await page?.locator(dropdownValueItem(type))?.click();
    });

    await cms.instruction('School admin clicks action button', async function () {
        await page?.locator(buttonAction).click();
    });

    await cms.instruction('School admin open import dialog', async function () {
        await page?.locator(buttonImportMaster).click();
    });

    await cms.instruction('School admin selects file csv import', async function () {
        const pathCSV = withDownloadPath(fileName);
        await page.setInputFiles(uploadInput, pathCSV);
    });

    await cms.instruction('School admin clicks import file', async function () {
        const dialogUserImport = page.locator(dialogWithHeaderFooterWrapper);
        await dialogUserImport.locator(footerDialogConfirmButtonSave).click();
    });
}

export async function openRegisterClassDialog(cms: CMSInterface, courseId: string) {
    const page = cms.page!;
    await cms.instruction('School admin open register class dialog', async function () {
        const courseRow = page.locator(studentCourseRowWithId(courseId));
        await courseRow.locator(actionPanelTriggerButton).click();
        await page.getByText('Register Class').click();
    });
}

export async function selectClassByName(cms: CMSInterface, className: string) {
    const page = cms.page!;

    await cms.instruction(
        `School admin chooses ${className} in dropdown option list`,
        async function () {
            await page.getByLabel('Class').click();
            await chooseAutocompleteOptionByExactText(cms, className);
        }
    );
    await cms.instruction(`School admin clicks Save button`, async function () {
        await page.click(buttonByAriaLabel('Save'));
        await page.locator(dialogWithHeaderFooterWrapper).waitFor({ state: 'hidden' });
        await cms.waitForSkeletonLoading();
    });
}

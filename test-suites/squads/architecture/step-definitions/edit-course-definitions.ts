import * as CMSKeys from '@legacy-step-definitions/cms-selectors/cms-keys';
import * as courseKeys from '@legacy-step-definitions/cms-selectors/course';

import { ElementHandle } from 'playwright';

import { CMSInterface } from '@supports/app-types';
import { sampleImageFilePath } from '@supports/constants';

import { notStrictEqual } from 'assert';
import { strictEqual } from 'assert';
import { schoolAdminGoToCourseDetail } from 'test-suites/common/step-definitions/course-definitions';
import { gotoEditPageOnCMS } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

export async function goToCourseDetailsOnCMS(cms: CMSInterface, courseName: string) {
    await cms.selectMenuItemInSidebarByAriaLabel('Course');

    await schoolAdminGoToCourseDetail(cms, courseName);
}

export async function editCourseNameOnCMS(cms: CMSInterface, newName: string) {
    await cms.instruction(
        `Edit course name into new name: ${newName} on Edit course page`,
        async function (cms: CMSInterface) {
            await cms.page?.fill(courseKeys.courseFormName, newName);
        }
    );

    await cms.selectAButtonByAriaLabel('Save');
}

export async function editCourseAvatarInEditCoursePage(cms: CMSInterface) {
    const cmsPage = cms.page!;

    const currentAvatarSrc = await schoolAdminGetAvatarSrc(cms);

    await cms.instruction(`Edit course avatar in Edit course page`, async function () {
        await cmsPage!.setInputFiles(courseKeys.avatarUpload, sampleImageFilePath);

        const newAvatarSrc = await schoolAdminGetAvatarSrc(cms);

        notStrictEqual(
            currentAvatarSrc,
            newAvatarSrc,
            `The avatar src should be changed when user uploads a new avatar`
        );
    });

    await cms.selectAButtonByAriaLabel('Save');
}

export async function editCourseAvatarInCourseSettingsPage(cms: CMSInterface) {
    const cmsPage = cms.page!;

    await goToSettingTabInCourseDetailsOnCMS(cms);

    const currentAvatarSrc = await schoolAdminGetAvatarSrc(cms);

    await cms.instruction(`Edit course avatar in Course Settings page`, async function () {
        await cmsPage.setInputFiles(courseKeys.avatarUpload, sampleImageFilePath);

        await cmsPage.waitForSelector(CMSKeys.snackbarContent);
    });

    const newAvatarSrc = await schoolAdminGetAvatarSrc(cms);

    notStrictEqual(
        currentAvatarSrc,
        newAvatarSrc,
        `The avatar src should be changed when user uploads a new avatar`
    );
}

export async function searchCourseInCourseList(cms: CMSInterface, courseName: string) {
    const cmsPage = cms.page!;

    await cms.selectMenuItemInSidebarByAriaLabel('Course');

    await cms.instruction(`Search course ${courseName}`, async function (this: CMSInterface) {
        await cmsPage!.type(CMSKeys.formFilterAdvancedTextFieldSearchInput, courseName);
        await cmsPage!.press(CMSKeys.formFilterAdvancedTextFieldSearchInput, 'Enter');
    });
}

export async function getAvatarSrc(
    page: ElementHandle<SVGElement | HTMLElement>,
    selector: string
): Promise<string> {
    const avatarWidget = await page!.waitForSelector(selector);
    const avatarSrc = await avatarWidget.getAttribute('src');

    return avatarSrc!;
}

export async function verifyCourseAvatarInCourseList(
    cms: CMSInterface,
    courseName: string,
    courseAvatar: string
) {
    const cmsPage = cms.page!;

    await searchCourseInCourseList(cms, courseName);

    await cms.instruction(
        `Verify course avatar ${courseAvatar} on Course List`,
        async function (this: CMSInterface) {
            const courseItem = await cmsPage.waitForSelector(
                CMSKeys.tableRowByText(courseKeys.courseTable, courseName)
            );

            const courseAvatarSrc = await getAvatarSrc(courseItem, courseKeys.imgSmallAvatar);
            strictEqual(
                courseAvatarSrc,
                courseAvatar,
                'The course avatar should be the same across the pages'
            );
        }
    );
}

export async function verifyCourseAvatarInEditCoursePage(cms: CMSInterface): Promise<string> {
    await gotoEditPageOnCMS(cms, 'Course');

    let newAvatarSrc = '';
    await cms.instruction(
        `Verify course avatar on Edit Course Page`,
        async function (cms: CMSInterface) {
            newAvatarSrc = await schoolAdminGetAvatarSrc(cms);
        }
    );

    await cms.selectAButtonByAriaLabel('Cancel');

    return newAvatarSrc;
}

export async function verifyCourseAvatarInSettingTab(cms: CMSInterface, courseAvatar: string) {
    await cms.instruction(
        `Verify course avatar ${courseAvatar} on Settings tab`,
        async function () {
            const courseAvatarSrcOnSettingsTab = await schoolAdminGetAvatarSrc(cms);

            strictEqual(
                courseAvatar,
                courseAvatarSrcOnSettingsTab,
                `Course avatar should be the same across the page`
            );
        }
    );
}

export async function verifyCourseNameInSettingTab(cms: CMSInterface, courseName: string) {
    await cms.instruction(`Verify course name ${courseName} on Settings tab`, async function () {
        await cms.waitForSelectorHasText(courseKeys.courseDetailsSettingTabCourseName, courseName);
    });
}

export async function goToSettingTabInCourseDetailsOnCMS(cms: CMSInterface) {
    const page = cms.page!;

    await cms.instruction(`Go to Settings tab`, async function () {
        await page.click(courseKeys.courseDetailsSettingTab);
    });
}

export const schoolAdminGetAvatarSrc = async (cms: CMSInterface) => {
    // Get the background URL source
    const element = await cms.page!.waitForSelector(CMSKeys.getTestId('AvatarInput__root'));
    const styleStr = (await element?.getAttribute('style')) || '';
    const src = styleStr.match(/\((.*?)\)/)?.[1].replace(/('|")/g, '') || '';

    return src;
};

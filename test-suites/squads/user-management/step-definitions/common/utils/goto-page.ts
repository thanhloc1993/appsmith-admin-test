import { studentDetailDataGRPCAlias } from '@user-common/alias-keys/student';
import {
    buttonGroupDropdown,
    buttonGroupDropdownPopover,
    buttonGroupDropdownValueItem,
} from '@user-common/cms-selectors/students-page';
import { CreateStudentResp } from '@user-common/types/student';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { schoolAdminSeesNewStudentBySearch } from './find-student';

export async function goToAddStudentPage(cms: CMSInterface) {
    await cms.instruction('Find and click Students tab', async function () {
        await cms.selectMenuItemInSidebarByAriaLabel('Students');
    });

    await cms.instruction('Click on Add Button', async function () {
        await cms.page?.locator(buttonGroupDropdown).click();
        const popoverAddButton = cms.page?.locator(buttonGroupDropdownPopover);

        await popoverAddButton?.locator(buttonGroupDropdownValueItem('NORMAL_ADD')).click();
    });
}

export async function goToEditPageAStudent(
    cms: CMSInterface,
    context: ScenarioContext,
    studentId?: string
) {
    await goToStudentDetailByURL(cms, context, studentId);

    await cms.selectAButtonByAriaLabel('Edit');
}

export async function goToStudentDetailByURL(
    cms: CMSInterface,
    context: ScenarioContext,
    studentId?: string
) {
    const origin = cms.origin;

    let originURL = origin + `${origin.endsWith('/') ? '' : '/'}user/students_erp`;

    const decodeStudentResp = context.get<CreateStudentResp>(studentDetailDataGRPCAlias);

    if (studentId) originURL = originURL + `/${studentId}/show`;

    const userId = decodeStudentResp.studentProfile?.student?.userProfile?.userId;

    if (userId && !studentId) originURL = originURL + `/${userId}/show`;

    await cms.page?.goto(originURL);

    await cms.instruction(`school admin sees the url ${originURL} of student`, async function () {
        await cms.attach(originURL);
        await cms.page?.waitForURL(originURL);
    });
}

export async function goToStudentDetailByMenu(
    cms: CMSInterface,
    context: ScenarioContext,
    studentName?: string
) {
    const decodeStudentResp = context.get<CreateStudentResp>(studentDetailDataGRPCAlias);

    await reloadPageAndGoToStudentList(cms);

    const userProfile = decodeStudentResp.studentProfile?.student?.userProfile;

    const keyWord =
        userProfile?.name || `${userProfile?.lastName} ${userProfile?.firstName}` || studentName;

    if (!keyWord)
        throw Error("Don't have name of student to search {function: goToStudentDetailByMenu}");

    await cms.instruction('shool admin sees students by search', async function () {
        const studentElement = await schoolAdminSeesNewStudentBySearch(cms, keyWord, 'sees');
        await studentElement?.click();
    });
}

export async function reloadPageAndGoToStudentList(cms: CMSInterface) {
    await cms.instruction(
        'School admin reload and goes to page on Student Management',
        async function () {
            await cms.page?.reload();
            await goToStudentListByMenu(cms);
        }
    );
}

export async function goToStudentListByMenu(cms: CMSInterface) {
    await cms.instruction(
        'School admin goes to page on Student Management by Menu',
        async function () {
            await cms.selectMenuItemInSidebarByAriaLabel('Students');
            await cms.assertThePageTitle('Student Management');
        }
    );
}

export async function goToStudentListByURL(cms: CMSInterface) {
    await cms.instruction(
        'School admin goes to page on Student Management by URL',
        async function () {
            const origin = cms.origin;

            const originURL = origin + `${origin.endsWith('/') ? '' : '/'}user/students_erp`;

            await cms.page?.goto(originURL);

            await cms.instruction(`school admin sees the url ${originURL}`, async function () {
                await cms.attach(originURL);
                await cms.page?.waitForURL(originURL);
            });

            await cms.assertThePageTitle('Student Management');
        }
    );
}

export async function goToStaffListByURL(cms: CMSInterface) {
    const origin = cms.origin;
    const originURL = origin + `${origin.endsWith('/') ? '' : '/'}user/staff`;
    await cms.page?.goto(originURL);
    await cms.instruction(`school admin sees the url ${originURL}`, async function () {
        await cms.attach(originURL);
        await cms.page?.waitForURL(originURL);
    });
    await cms.assertThePageTitle('Staff Management');
}

export async function goToStaffListByMenu(cms: CMSInterface) {
    await cms.selectMenuItemInSidebarByAriaLabel('Staff Management');
    await cms.assertThePageTitle('Staff Management');
}

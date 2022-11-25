import { TeacherKeys } from '@common/teacher-keys';
import * as CMSKeys from '@legacy-step-definitions/cms-selectors/cms-keys';
import { neverLoggedInSelector } from '@user-common/cms-selectors/student';

import { ElementHandle } from 'playwright';

import { CMSInterface, TeacherInterface } from '@supports/app-types';

import { gotoEditPageOnCMS } from './user-definition-utils';
import { strictEqual } from 'assert';
import { ByValueKey } from 'flutter-driver-x';

export type NeverLoggedInTagPositionOnCMS =
    | 'Student List'
    | 'Student Details'
    | 'Lesson Details'
    | 'Add Lesson'
    | 'Add Student on Add Lesson'
    | 'Edit Lesson'
    | 'Add Student on Edit Lesson';

export type StudentListPositionOnCMS = 'Student Management' | 'Lesson Management';

export async function verifyNeverLoggedInTagOnCMS(
    cms: CMSInterface,
    username: string,
    neverLoggedInTagPositionOnCMS: NeverLoggedInTagPositionOnCMS,
    hasLoggedInTag: boolean,
    parent: ElementHandle<SVGElement | HTMLElement>
) {
    await cms.instruction(
        `Verify "Never logged in" tag of ${username} at ${neverLoggedInTagPositionOnCMS} on CMS ${
            hasLoggedInTag ? 'is shown' : 'is hidden'
        }`,
        async function (this: CMSInterface) {
            if (hasLoggedInTag) {
                await parent.waitForSelector(neverLoggedInSelector, { state: 'visible' });
            } else {
                const neverLoggedInTag = await parent.$(neverLoggedInSelector);

                strictEqual(neverLoggedInTag, null, 'The Never logged in tag should not show');
            }
        }
    );
}

export type NeverLoggedInTagPositionOnTeacher =
    | 'Student Tab in Course Details'
    | 'Student List in Lesson Details'
    | 'Student Information';

export async function verifyNeverLoggedInTagOnTeacherWeb(
    teacher: TeacherInterface,
    username: string,
    neverLoggedInTagPositionOnTeacher: NeverLoggedInTagPositionOnTeacher,
    hasLoggedInTag: boolean
) {
    const driver = teacher.flutterDriver!;

    await teacher.instruction(
        `Verify "Never logged in" tag at ${neverLoggedInTagPositionOnTeacher} on Teacher App ${
            hasLoggedInTag ? 'is shown' : 'is hidden'
        }`,
        async function (this: CMSInterface) {
            const neverLoggedInTagFinder = new ByValueKey(
                TeacherKeys.notLoggedInTagWithUserName(username)
            );

            if (hasLoggedInTag) {
                await driver.waitFor(neverLoggedInTagFinder);
            } else {
                await driver.waitForAbsent(neverLoggedInTagFinder);
            }
        }
    );
}

export function convertFromNeverLoggedInTagPositionIntoStudentListPosition(
    neverLoggedInTagPositionOnCMS: NeverLoggedInTagPositionOnCMS
): StudentListPositionOnCMS {
    if (
        neverLoggedInTagPositionOnCMS === 'Add Student on Add Lesson' ||
        neverLoggedInTagPositionOnCMS === 'Add Student on Edit Lesson' ||
        neverLoggedInTagPositionOnCMS === 'Add Lesson' ||
        neverLoggedInTagPositionOnCMS === 'Edit Lesson' ||
        neverLoggedInTagPositionOnCMS === 'Lesson Details'
    ) {
        return 'Lesson Management';
    } else {
        return 'Student Management';
    }
}

export async function goToEditLessonOfTheFirstLesson(cms: CMSInterface) {
    const cmsPage = cms.page!;

    await cms.page?.reload();
    await cms.selectMenuItemInSidebarByAriaLabel('Live Lessons');

    await cms.instruction(`Go to first lesson details`, async function () {
        const tableLesson = await cmsPage.waitForSelector(CMSKeys.tableBaseBody);
        const items = await tableLesson.$$(CMSKeys.tableBaseRow);
        const hrefElement = await items[0]!.$('a');
        await hrefElement?.click();
    });

    await gotoEditPageOnCMS(cms, 'Lesson');

    await cms.instruction(`Click on Add Student button`, async function () {
        await cms.page!.click(CMSKeys.tableActionAddButton(CMSKeys.tableStudent));
    });
}

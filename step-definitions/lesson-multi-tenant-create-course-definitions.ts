import { AccountRoles, CMSInterface, TeacherInterface } from '@supports/app-types';
import { Menu } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasCourseIdByCourseName } from './alias-keys/lesson';
import { courseFormName } from './cms-selectors/course';
import { courseDetailTitle } from './cms-selectors/lesson';
import {
    createNewCourse,
    LocationLevel,
    openCreateCoursePage,
    openLocationPopup,
    saveLocationPopup,
    schoolAdminSelectLocationOfParentLocation,
} from './lesson-create-course-with-teaching-method-definitions';
import { searchCourseByKeyword } from './lesson-search-course-on-teacher-app-definitions';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';
import * as CMSKeys from 'step-definitions/cms-selectors/cms-keys';
import { teacherGenCourseDetailUrl } from 'test-suites/common/step-definitions/course-definitions';

export async function createCourseWithOptionalLocation(
    cms: CMSInterface,
    primaryRole: AccountRoles,
    scenarioContext: ScenarioContext,
    courseName: string,
    locationLevel: LocationLevel | undefined = undefined
) {
    await cms.instruction('Go to the course page', async function () {
        await cms.schoolAdminIsOnThePage(Menu.COURSES, 'Course');
    });

    await cms.instruction(`${primaryRole} has opened creating lesson page`, async function () {
        await openCreateCoursePage(cms);
    });

    await cms.instruction(
        `${primaryRole} has filled course name: ${courseName}`,
        async function () {
            await cms.page!.fill(courseFormName, courseName);
        }
    );

    if (locationLevel) {
        await cms.instruction(`${primaryRole} has opened location popup`, async function () {
            await openLocationPopup(cms);
        });

        await cms.instruction(
            `${primaryRole} has select location: ${locationLevel}`,
            async function () {
                await schoolAdminSelectLocationOfParentLocation(
                    cms,
                    scenarioContext,
                    locationLevel
                );
            }
        );

        await cms.instruction(
            `${primaryRole} saves selected location in location popup`,
            async function () {
                await saveLocationPopup(cms);
            }
        );
    }

    await cms.instruction(
        `${primaryRole} press save button to create a new course`,
        async function () {
            await createNewCourse(cms);
        }
    );

    await cms.instruction(`${primaryRole} is redirected to course list page`, async function () {
        await cms.assertThePageTitle('Course');
    });

    await cms.instruction('program is getting course id in the background', async function () {
        const courseElement = await cms.page!.waitForSelector(
            CMSKeys.courseTableCourseNameLink(courseName)
        );
        const courseDetailURL = await courseElement.getAttribute('href');
        const [courseId] = courseDetailURL!.match(/([0-9]|[A-Z])\w+/g) || [];
        weExpect(courseId, 'Expect courseId matches id format').toHaveLength(26);

        scenarioContext.set(aliasCourseIdByCourseName(courseName), courseId);
    });
}

export async function checkCourseNameIsOnPage(
    cms: CMSInterface,
    courseName: string,
    visible: boolean
) {
    await cms.page!.waitForSelector(CMSKeys.courseTableCourseNameLink(courseName), {
        state: visible ? 'visible' : 'hidden',
    });
}

export async function checkCourseNameIsOnTeacherApp(
    teacher: TeacherInterface,
    courseName: string,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;
    const key = TeacherKeys.course(courseName);

    await teacher.instruction(`search course by courseName: ${courseName}`, async function () {
        await removeTextInSearchBar(teacher);
        await searchCourseByKeyword(teacher, courseName);
    });

    await teacher.instruction(
        `${visible ? '' : 'not'} sees course course with name: ${courseName}`,
        async function () {
            if (visible) await driver.waitFor(new ByValueKey(key));
            else await driver.waitForAbsent(new ByValueKey(key));
        }
    );
}

export async function viewDetailCourseByURL(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    courseName: string
) {
    const courseId = scenarioContext.get(aliasCourseIdByCourseName(courseName));
    await cms.page!.goto(`/syllabus/courses/${courseId}/show`);
}

export async function checkCourseDetailVisibility(cms: CMSInterface, courseName: string) {
    // TODO: https://manabie.atlassian.net/browse/LT-12322
    try {
        await cms.waitingForLoadingIcon();
    } catch (err) {
        await cms.page!.waitForSelector(courseDetailTitle(courseName), { state: 'hidden' });
    }
}

export async function viewDetailCourseOnTeacherApp(
    teacher: TeacherInterface,
    scenarioContext: ScenarioContext,
    courseName: string
) {
    const courseId = scenarioContext.get(aliasCourseIdByCourseName(courseName));
    const courseDetailURL = await teacherGenCourseDetailUrl(teacher, courseId);
    await teacher.flutterDriver!.webDriver!.page.goto(courseDetailURL);
}

export async function checkCourseDetailVisibilityOnTeacherApp(teacher: TeacherInterface) {
    const invalidURLScreen = new ByValueKey(TeacherKeys.invalidURLScreen);
    await teacher.flutterDriver!.waitFor(invalidURLScreen, 10000);
}

export async function removeTextInSearchBar(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    await driver.setTextEntryEmulation({ enabled: false });
    const searchCourseInput = new ByValueKey(TeacherKeys.searchCourseInput);
    await driver.tap(searchCourseInput);
    await driver.webDriver!.page.keyboard.down('ControlLeft');
    await driver.webDriver!.page.keyboard.down('a');
    await driver.webDriver!.page.keyboard.up('ControlLeft');
    await driver.webDriver!.page.keyboard.up('a');
    await driver.webDriver!.page.keyboard.press('Backspace');
    await driver.setTextEntryEmulation({ enabled: true });
}

import { TeacherInterface, TeacherPages } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasCourseName } from './alias-keys/lesson';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function searchCourseByKeyword(teacher: TeacherInterface, keyword: string) {
    const driver = teacher.flutterDriver!;

    await driver.setTextEntryEmulation({ enabled: false });
    const searchCourseInput = new ByValueKey(TeacherKeys.searchCourseInput);
    await driver.tap(searchCourseInput);
    await driver.webDriver!.page.keyboard.type(keyword);
    await driver.webDriver!.page.keyboard.press('Enter');
    await driver.setTextEntryEmulation({ enabled: true });
}

export async function removeTextInSearchBar(teacher: TeacherInterface, scenario: ScenarioContext) {
    const driver = teacher.flutterDriver!;
    await driver.setTextEntryEmulation({ enabled: false });
    const searchCourseInput = new ByValueKey(TeacherKeys.searchCourseInput);
    const keyword = scenario.get(aliasCourseName);
    await driver.tap(searchCourseInput);
    // clear text on search bar
    for (let i = 0; i < keyword.length; i++)
        await driver.webDriver!.page.keyboard.press('Backspace');
    await driver.setTextEntryEmulation({ enabled: true });
}

export async function pressEnterSearchBar(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    await driver.setTextEntryEmulation({ enabled: false });
    const searchCourseInput = new ByValueKey(TeacherKeys.searchCourseInput);
    await driver.tap(searchCourseInput);
    await driver.webDriver!.page.keyboard.press('Enter');
    await driver.setTextEntryEmulation({ enabled: true });
}

export async function goToPageOnTeacherApp(teacher: TeacherInterface, page: TeacherPages) {
    const driver = teacher.flutterDriver!;
    let key: string;
    let screenKey: string;
    switch (page) {
        case 'To Review':
            key = TeacherKeys.toReviewButton;
            screenKey = TeacherKeys.toReviewScreen;
            break;
        case 'Message':
            key = TeacherKeys.messageButton;
            screenKey = TeacherKeys.messagingScreen;
            break;
    }
    await driver.tap(new ByValueKey(key));
    await driver.waitFor(new ByValueKey(screenKey));
}

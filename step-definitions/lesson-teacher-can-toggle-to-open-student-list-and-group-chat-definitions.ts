import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';
import { teacherSelectLessonChatGroup } from 'test-suites/squads/communication/step-definitions/communication-create-live-lesson-chat-group-definitions';
import {
    teacherTapsUserButtonToHideStudentList,
    teacherTapsUserButtonToShowStudentList,
} from 'test-suites/squads/virtual-classroom/step-definitions/turn-on-raise-hand-definitions';

export type LessonLiveLessonRightDrawerTab = 'student list' | 'group chat';
export type LessonLiveLessonRightDrawerIcon = 'student list icon' | 'group chat icon';

export async function teacherOpensRightDrawerByIcon(
    teacher: TeacherInterface,
    icon: LessonLiveLessonRightDrawerIcon
) {
    switch (icon) {
        case 'student list icon':
            await teacherTapsUserButtonToShowStudentList(teacher);
            break;
        case 'group chat icon':
            await teacherSelectLessonChatGroup(teacher);
            break;
    }
}

export async function teacherHidesRightDrawerByIcon(
    teacher: TeacherInterface,
    icon: LessonLiveLessonRightDrawerIcon
) {
    switch (icon) {
        case 'student list icon':
            await teacherTapsUserButtonToHideStudentList(teacher);
            break;
        case 'group chat icon':
            await teacherSelectLessonChatGroup(teacher);
            break;
    }
}

export async function teacherSeesTabVisibleOfRightDrawerOnTeacherApp(
    teacher: TeacherInterface,
    tab: LessonLiveLessonRightDrawerTab,
    visible: boolean
) {
    switch (tab) {
        case 'student list':
            await teacherSeesUserTabVisibleOnTeacherApp(teacher, visible);
            break;
        case 'group chat':
            await teacherSeesChatTabVisibleOnTeacherApp(teacher, visible);
            break;
    }
}

export async function teacherSeesUserTabVisibleOnTeacherApp(
    teacher: TeacherInterface,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;

    const rightDrawer = new ByValueKey(TeacherKeys.liveLessonRightDrawer(true));
    const userTab = new ByValueKey(TeacherKeys.liveLessonUserTab);
    if (visible) {
        await driver.waitFor(rightDrawer);
        await driver.waitFor(userTab);
    } else {
        try {
            await driver.waitForAbsent(rightDrawer);
        } catch {
            await driver.waitForAbsent(userTab);
        }
    }
}

export async function teacherSeesChatTabVisibleOnTeacherApp(
    teacher: TeacherInterface,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;

    const rightDrawer = new ByValueKey(TeacherKeys.liveLessonRightDrawer(true));
    const chatTab = new ByValueKey(TeacherKeys.liveLessonChatTab);
    if (visible) {
        await driver.waitFor(rightDrawer);
        await driver.waitFor(chatTab);
    } else {
        try {
            await driver.waitForAbsent(rightDrawer);
        } catch {
            await driver.waitForAbsent(chatTab);
        }
    }
}

export async function learnerSeesChatTabVisibleOnLearnerApp(
    learner: LearnerInterface,
    visible: boolean
) {
    const driver = learner.flutterDriver!;
    const rightDrawer = new ByValueKey(LearnerKeys.liveLessonRightDrawer(true));

    if (visible) {
        const chatTab = new ByValueKey(LearnerKeys.liveLessonChatTab);
        await driver.waitFor(rightDrawer);
        await driver.waitFor(chatTab);
    } else {
        await driver.waitForAbsent(rightDrawer);
    }
}

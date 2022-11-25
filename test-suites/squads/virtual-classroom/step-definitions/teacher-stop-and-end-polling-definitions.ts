import { TeacherKeys } from '@common/teacher-keys';

import { TeacherInterface } from '@supports/app-types';
import { PollingStatus } from '@supports/enum';

import { ByValueKey } from 'flutter-driver-x';

export async function teacherStopsPollingOnTeacherApp(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    const stopPollingButton = TeacherKeys.teachingPollStopPollingButtonWithStatus(
        PollingStatus.POLLING_STARTED
    );

    await driver.tap(new ByValueKey(stopPollingButton), 10000);
}

export async function teacherIsInPollingStatsPageOnTeacherApp(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const pollingStatsPageKey = TeacherKeys.pollingStatsPageKey;
    await driver.waitFor(new ByValueKey(pollingStatsPageKey));
}

export async function teacherEndsPollingOnTeacherApp(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    const stopPollingButton = TeacherKeys.teachingPollStopPollingButtonWithStatus(
        PollingStatus.POLLING_STOPPED
    );

    await driver.tap(new ByValueKey(stopPollingButton));
}

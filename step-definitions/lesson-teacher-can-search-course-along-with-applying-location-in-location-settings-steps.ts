import { Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { aliasCourseName } from './alias-keys/lesson';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { getTeacherInterfaceFromRole } from './utils';
import { ByValueKey } from 'flutter-driver-x';

Then(
    '{string} sees course which has name contains the keyword and location is included in selected location settings',
    async function (role: AccountRoles) {
        const scenario = this.scenario!;
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} sees course which has name contains the keyword and location is included in selected location settings`,
            async function () {
                const course = new ByValueKey(
                    TeacherKeys.course(scenario.get<string>(aliasCourseName))
                );
                await teacher.flutterDriver!.waitFor(course);
            }
        );
    }
);

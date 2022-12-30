import { goToLessonDetailByLessonIdOnLessonList } from '@legacy-step-definitions/lesson-delete-lesson-of-lesson-management-definitions';
import { schoolAdminSeesTeachingMedium } from '@legacy-step-definitions/lesson-edit-teaching-medium-of-past-lesson-definitions';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasLessonId, aliasLessonTime } from 'test-suites/squads/lesson/common/alias-keys';
import { UserProfileEntity } from 'test-suites/squads/lesson/common/lesson-profile-entity';
import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { TeachingMediumValueType } from 'test-suites/squads/lesson/types/lesson-management';

export async function assertUpdatedTeachingMedium(
    cms: CMSInterface,
    scenario: ScenarioContext,
    teachingMedium: TeachingMediumValueType
) {
    const lessonId = scenario.get<string>(aliasLessonId);
    const lessonTime = scenario.get<LessonTimeValueType>(aliasLessonTime);
    const { name: studentName } = scenario.get<UserProfileEntity>(
        learnerProfileAliasWithAccountRoleSuffix('student')
    );
    await cms.instruction(`Go to the new ${lessonTime} lesson detail`, async function () {
        await goToLessonDetailByLessonIdOnLessonList({
            cms,
            lessonTime,
            lessonId,
            studentName,
        });
    });
    await cms.instruction(`See ${teachingMedium} on lesson detail`, async function () {
        await schoolAdminSeesTeachingMedium(cms, teachingMedium);
    });
}

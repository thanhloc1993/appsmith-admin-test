import { aliasTeacherName } from '@legacy-step-definitions/alias-keys/lesson';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    teacherAutocompleteInput,
    teacherNameChip,
} from 'test-suites/squads/lesson/common/cms-selectors';
import { selectTeacher } from 'test-suites/squads/lesson/utils/lesson-upsert';
import { createARandomStaffFromGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-staff-definitions';

export async function createTeachers(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    numberTeacher: number
) {
    const teachersName: string[] = [];

    for (let order = 0; order < numberTeacher; order++) {
        const teacherName = (await createARandomStaffFromGRPC(cms)).name;
        teachersName.push(teacherName);
    }

    scenarioContext.set(aliasTeacherName, teachersName);
}

export async function clearSearchTeacher(cms: CMSInterface) {
    const page = cms.page!;
    const teacherInput = await page.waitForSelector(teacherAutocompleteInput);

    await cms.instruction('Clear search teacher', async function () {
        await teacherInput.fill('');
    });
}

export async function searchTeacher(cms: CMSInterface, teacherName: string) {
    const page = cms.page!;
    const teacherInput = await page.waitForSelector(teacherAutocompleteInput);

    await cms.instruction(`Search teacher ${teacherName}`, async function () {
        await teacherInput.click();
        await teacherInput.fill(teacherName);
        await cms.waitingAutocompleteLoading();
    });
}

export async function searchAndSelectTeachers(cms: CMSInterface, scenarioContext: ScenarioContext) {
    const teachersName = scenarioContext.get(aliasTeacherName);

    for (const teacherName of teachersName) {
        await searchTeacher(cms, teacherName);
        await selectTeacher(cms, teacherName);
    }
}

export async function searchAndClearTeachers(cms: CMSInterface, scenarioContext: ScenarioContext) {
    const teachersName = scenarioContext.get(aliasTeacherName);

    for (const teacherName of teachersName) {
        await searchTeacher(cms, teacherName);
        await clearSearchTeacher(cms);
    }
}

export async function seesTeacherInTeacherField(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const teachersName = scenarioContext.get(aliasTeacherName);

    for (const teacherName of teachersName) {
        await cms.instruction(`see teacher ${teacherName} in field`, async function () {
            await cms.page!.waitForSelector(teacherNameChip(teacherName));
        });
    }
}

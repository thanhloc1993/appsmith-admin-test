import { CMSInterface, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasLocationId } from './alias-keys/lesson';
import { saveDialogButton } from './cms-selectors/cms-keys';
import {
    clickLocationCheckbox,
    openLocationSettingInCMS,
} from './lesson-apply-location-settings-for-lesson-list-definitions';
import { teacherChangesToMaterialTabAndCheckMaterialList } from './lesson-edit-lesson-material-definitions';
import { teacherPreviewLessonMaterialOnTeacherApp } from './lesson-teacher-preview-material-definitions';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';
import { aliasMaterialName } from 'test-suites/squads/lesson/common/alias-keys';
import { LessonMaterialMultipleType } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';

export async function appliedLocationByIdInCMS(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const page = cms.page!;
    const locationId = scenarioContext.get(aliasLocationId);

    await cms.instruction(
        'school admin opens location settings in nav bar on CMS',
        async function () {
            await openLocationSettingInCMS(cms);
        }
    );

    await cms.instruction(
        'school admin applies location which matches location of lesson',
        async function () {
            await clickLocationCheckbox(page, locationId);
            await cms.selectElementByDataTestId(saveDialogButton);
        }
    );
}

export async function teacherSeeMaterialsOnLessonDetailOnTeacherApp(params: {
    teacher: TeacherInterface;
    materialNameArr: Array<LessonMaterialMultipleType>;
    numberOfList: number;
    scenarioContext: ScenarioContext;
}) {
    const { teacher, materialNameArr, numberOfList, scenarioContext } = params;
    const driver = teacher.flutterDriver!;

    for (const materialNameTmp of materialNameArr) {
        const materialName = scenarioContext.get(aliasMaterialName[materialNameTmp]);

        await teacher.instruction(
            `teacher changes to material tab and sees material ${materialName}`,
            async function () {
                await teacherChangesToMaterialTabAndCheckMaterialList(teacher, numberOfList);
                const materialItem = new ByValueKey(TeacherKeys.mediaItem(materialName));
                await driver.waitFor(materialItem);
            }
        );
    }
}

export async function teacherPreviewLessonMaterialsOnTeacherApp(params: {
    teacher: TeacherInterface;
    materialNameArr: Array<LessonMaterialMultipleType>;
    scenarioContext: ScenarioContext;
}) {
    const { teacher, materialNameArr, scenarioContext } = params;

    for (const material of materialNameArr) {
        const materialName = scenarioContext.get(aliasMaterialName[material]);
        await teacher.instruction(`Teacher preview material: ${materialName}`, async function () {
            await teacherPreviewLessonMaterialOnTeacherApp(teacher, material, materialName);
            await teacher.page!.goBack();
        });
    }
}

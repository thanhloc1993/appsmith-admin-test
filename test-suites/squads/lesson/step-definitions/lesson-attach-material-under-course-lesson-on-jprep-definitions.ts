import { CMSInterface, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    actionPanelTrigger,
    actionPanelUploadOption,
    lessonTabInCourse,
    lessonTableRow,
    saveButtonUploadMaterial,
} from 'test-suites/squads/lesson/common/cms-selectors';
import { MaterialFile } from 'test-suites/squads/lesson/types/material';
import {
    previewMaterialOnCMS,
    previewMaterialTeacherApp,
    removeMaterialChip,
    uploadMaterials,
    waitUploadMaterialResponses,
} from 'test-suites/squads/lesson/utils/materials';
import { retry } from 'ts-retry-promise';

export async function uploadMaterialForJprepCourse(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    materials: MaterialFile[];
}) {
    const { cms, scenarioContext, materials } = params;

    const page = cms.page!;

    await page.locator(lessonTabInCourse).click();
    let foundLesson = false;

    await retry(
        async function () {
            try {
                const lessonRow = await page.waitForSelector(lessonTableRow, { timeout: 2500 });
                if (lessonRow) foundLesson = true;
            } catch {
                await page.reload();
            }
        },
        { retries: 2, delay: 3000, until: () => foundLesson === true }
    ).catch(function (error) {
        throw Error(
            `Can not find the lesson: ${JSON.stringify(
                error
            )}, maybe can't sync lesson to course in 5s`
        );
    });

    await page.locator(actionPanelTrigger).click();
    await page.locator(actionPanelUploadOption).click();

    await uploadMaterials({ cms, materials });

    await waitUploadMaterialResponses({
        cms,
        scenarioContext,
        materials,
        triggerElementQuery: saveButtonUploadMaterial,
    });
}

export async function previewMaterialInLessonTabOfCourse(params: {
    cms: CMSInterface;
    materials: MaterialFile[];
}) {
    const { cms, materials } = params;

    for (const material of materials) {
        await previewMaterialOnCMS({ cms, material });
    }
}

export async function previewMaterialInLiveLesson(params: {
    teacher: TeacherInterface;
    materials: MaterialFile[];
}) {
    const { teacher, materials } = params;

    for (const material of materials) {
        await previewMaterialTeacherApp({ teacher, material });
        await teacher.page!.goBack();
    }
}

export async function removeMaterialForJprepCourse(params: {
    cms: CMSInterface;
    materials: MaterialFile[];
}) {
    const { cms, materials } = params;

    for (const material of materials) {
        await removeMaterialChip({ cms, material });
    }
}

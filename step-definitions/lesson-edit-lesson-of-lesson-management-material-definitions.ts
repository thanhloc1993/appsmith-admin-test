import { CMSInterface, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasPDFUploadedURL } from './alias-keys/lesson';
import * as CMSKeys from './cms-selectors/cms-keys';
import { chipFileContainer } from './cms-selectors/lesson';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';
import { toArr } from 'step-definitions/utils';
import {
    addMaterialToLesson,
    assertToSeeTheLessonOnTeacherApp,
    LessonMaterialSingleType,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';

export async function uploadMaterialForLesson(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    materials: LessonMaterialSingleType | LessonMaterialSingleType[]
) {
    const toBeUploadMaterials = toArr(materials);

    for (const material of toBeUploadMaterials) {
        await addMaterialToLesson({ cms, scenarioContext, type: material });
    }
}

export async function assertMaterialAtLessonDetail(params: {
    cms: CMSInterface;
    scenario: ScenarioContext;
    material: LessonMaterialSingleType;
    shouldVisible?: boolean;
}) {
    const { cms, scenario, material, shouldVisible = true } = params;
    const page = cms.page!;

    const state: Parameters<typeof page.waitForSelector>[1]['state'] = shouldVisible
        ? 'visible'
        : 'hidden';

    const { fileIconPDF, fileIconVideo, pdfMediaExternalLink } = CMSKeys;

    switch (material) {
        case 'pdf': {
            const resumableURL = scenario.get(aliasPDFUploadedURL);

            await page.waitForSelector(fileIconPDF, { state });
            await page.waitForSelector(pdfMediaExternalLink(resumableURL), { state });
            return;
        }

        case 'video': {
            await page.waitForSelector(fileIconVideo, { state });
            return;
        }

        default:
            return;
    }
}

export async function teacherGoToLessonDetailOfLessonManagementOnTeacherApp(params: {
    teacher: TeacherInterface;
    courseId: string;
    lessonId: string;
    lessonName: string;
    lessonTime: LessonManagementLessonTime;
    lessonItemShouldDisplay?: boolean;
}) {
    const { teacher, courseId, lessonId, lessonName, lessonTime } = params;
    const driver = teacher.flutterDriver!;

    await teacher.instruction(
        `Teacher goes to ${lessonTime} lesson (${lessonId}) detail with course id: ${courseId}`,
        async function () {
            await assertToSeeTheLessonOnTeacherApp(params);

            const lessonItem = new ByValueKey(TeacherKeys.liveLessonItem(lessonId, lessonName));
            await driver.tap(lessonItem);
        }
    );
}

export async function assertMaterialOnMaterialListOfLessonOnTeacherApp(params: {
    teacher: TeacherInterface;
    courseId: string;
    lessonId: string;
    lessonName: string;
    lessonTime: LessonManagementLessonTime;
    materialName: string;
    shouldBeOnList?: boolean;
}) {
    const { teacher, materialName, shouldBeOnList = true, ...restLessonInfo } = params;
    const driver = teacher.flutterDriver!;
    const { materialTab, mediaItem } = TeacherKeys;

    await teacherGoToLessonDetailOfLessonManagementOnTeacherApp({ teacher, ...restLessonInfo });

    await teacher.instruction('Teacher goes to material list of the lesson', async function () {
        const lessonMaterialTab = new ByValueKey(materialTab);
        await driver.tap(lessonMaterialTab);
    });

    await teacher.instruction(
        `Assert material ${shouldBeOnList ? '' : 'not'} visible`,
        async function () {
            const material = new ByValueKey(mediaItem(materialName));
            shouldBeOnList ? await driver.waitFor(material) : await driver.waitForAbsent(material);
        }
    );
}

export async function removeMaterialFromLesson(
    cms: CMSInterface,
    material: LessonMaterialSingleType
) {
    const page = cms.page!;

    const { fileIconPDF, fileIconVideo, removeMaterialButton } = CMSKeys;
    const targetMaterialIcon = material === 'pdf' ? fileIconPDF : fileIconVideo;

    const allMaterialChips = await page.$$(chipFileContainer);

    for (const materialChip of allMaterialChips) {
        const desireMaterial = await materialChip.$(targetMaterialIcon);

        if (desireMaterial) {
            const removeButton = await materialChip.$(removeMaterialButton);

            if (removeButton) {
                await removeButton.click();
                await cms.selectAButtonByAriaLabel('Remove');
                return;
            }
        }
    }
}

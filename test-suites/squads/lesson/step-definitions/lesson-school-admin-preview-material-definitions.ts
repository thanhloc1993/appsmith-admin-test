import { aliasPDFUploadedURL } from '@legacy-step-definitions/alias-keys/lesson';
import * as CMSKeys from '@legacy-step-definitions/cms-selectors/cms-keys';
import * as LessonKeys from '@legacy-step-definitions/cms-selectors/lesson';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    LessonMaterial,
    LessonMaterialSingleType,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';

export async function assertLessonDetailHasMaterial(
    cms: CMSInterface,
    material: LessonMaterialSingleType
) {
    const page = cms.page!;

    await cms.instruction(`Assert see ${material} on lesson detail`, async function () {
        switch (material) {
            case 'pdf':
                await page.waitForSelector(CMSKeys.fileIconPDF);
                break;

            default:
                await page.waitForSelector(CMSKeys.fileIconVideo);
                break;
        }
    });
}

export async function previewMaterialFileOnCMS(
    cms: CMSInterface,
    scenario: ScenarioContext,
    material: LessonMaterial
) {
    const page = cms.page!;

    await cms.instruction(`Click to preview ${material} on lesson detail`, async function () {
        switch (material) {
            case 'pdf':
            case 'pdf 1':
            case 'pdf 2': {
                await page.waitForSelector(CMSKeys.fileIconPDF);

                const pdfUrl = scenario.get(aliasPDFUploadedURL);
                await page.click(CMSKeys.pdfMediaExternalLink(pdfUrl));

                break;
            }

            default: {
                const materialChips = await page.$$(LessonKeys.chipFileContainer);

                for (const chip of materialChips) {
                    const videoChip = await chip.$(CMSKeys.fileIconVideo);
                    if (videoChip) {
                        await chip.click();
                        await page.waitForSelector(CMSKeys.brightcoveVideoPlayer);
                        await page.click(LessonKeys.lessonCloseVideoMaterial);
                    }
                    // Because NotificationTaskbar__list renders overwrite `CMSKeys.fileIconVideo` in some cases with small windows size
                    // So we got an error when we tried to click `CMSKeys.fileIconVideo`
                }

                break;
            }
        }
    });
}

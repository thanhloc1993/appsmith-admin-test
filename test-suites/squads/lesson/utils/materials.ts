import { TeacherKeys } from '@common/teacher-keys';
import { VirtualClassroomKeys } from '@common/virtual-classroom-keys';
import { arrayHasItem } from '@legacy-step-definitions/utils';

import { Response } from 'playwright';

import { CMSInterface, TeacherInterface } from '@supports/app-types';
import createGrpcMessageDecoder from '@supports/packages/grpc-message-decoder';
import { ScenarioContext } from '@supports/scenario-context';

import { ByValueKey, delay } from 'flutter-driver-x';
import { UpsertMediaResponse } from 'manabie-bob/class_pb';
import { ResumableUploadURLResponse } from 'manabuf/bob/v1/uploads_pb';
import { Material } from 'manabuf/lessonmgmt/v1/lessons_pb';
import { aliasMaterialId, aliasUploadedPDFUrl } from 'test-suites/squads/lesson/common/alias-keys';
import {
    closePreviewVideoDialogButton,
    materialChipByName,
    materialChipByTitle,
    materialChipContainer,
    materialRemoveIcon,
    previewVideoContainer,
    uploadMaterialInput,
} from 'test-suites/squads/lesson/common/cms-selectors';
import { MaterialFile, MaterialFileState } from 'test-suites/squads/lesson/types/material';
import {
    waitAttachMaterialResponse,
    waitConvertMediaResponse,
    waitCreateBrightcoveUpload,
    waitFinishBrightcoveUpload,
    waitResumableURLResponse,
    waitUpsertMediaResponse,
} from 'test-suites/squads/lesson/utils/jprep-grpc';

export function toArr<T>(e: T | Array<T>): T[] {
    return Array.isArray(e) ? e : [e];
}

export function toShortenStr(str: string, max = 30) {
    if (str.length <= max) return str;
    return str.slice(0, max) + '...';
}

function getSampleMaterialPath(type: MaterialFile) {
    switch (type) {
        case 'pdf':
        case 'pdf 1':
            return './assets/lesson-sample-pdf-1.pdf';

        case 'pdf 2':
            return './assets/lesson-sample-pdf-2.pdf';

        case 'video':
        case 'video 1':
            return './assets/lesson-sample-video-1.mp4';

        case 'video 2':
            return './assets/lesson-sample-video-2.mp4';

        default:
            return '';
    }
}

export function getMaterialName(type: MaterialFile) {
    return getSampleMaterialPath(type).split('/').pop()!;
}

function isMaterialFile(fileType: any): fileType is MaterialFile {
    return Boolean(getSampleMaterialPath(fileType));
}

export function convertToMaterialType(rawMaterial: string): MaterialFile[] {
    const splittedItems = rawMaterial.split(', ');

    return splittedItems.reduce((materials: MaterialFile[], item) => {
        if (isMaterialFile(item)) materials.push(item);
        return materials;
    }, []);
}

export async function uploadMaterials(params: { cms: CMSInterface; materials: MaterialFile[] }) {
    const { cms, materials } = params;
    const page = cms.page!;

    const listOfMaterial = toArr(materials);

    for (const material of listOfMaterial) {
        const materialPath = getSampleMaterialPath(material);
        await page.locator(uploadMaterialInput).setInputFiles(materialPath);
    }
}

export async function removeMaterials(params: { cms: CMSInterface; materials: MaterialFile[] }) {
    const { cms, materials } = params;
    for (const material of materials) {
        await removeMaterialChip({ cms, material });
    }
}

export async function getUpsertedMediaIds(
    mediaIdsResponse: Response,
    expectCount: number
): Promise<string[]> {
    const decoder = createGrpcMessageDecoder(UpsertMediaResponse);
    const encodedResponseText = await mediaIdsResponse.text();
    const decodedResponse = decoder.decodeMessage(encodedResponseText);

    const rawMediaIds = decodedResponse?.toObject().mediaIdsList;

    if (!rawMediaIds || !arrayHasItem(rawMediaIds)) return [];

    const mediaIds: string[] = [];

    rawMediaIds.forEach((mediaId) => {
        if (mediaId !== '') {
            // We had a case that even though upload was successful, id returned = ""
            mediaIds.push(mediaId);
        }
    }, []);

    weExpect(
        mediaIds.length,
        `Expect upload get ${mediaIds.length} media ids after upload`
    ).toEqual(expectCount);

    return mediaIds;
}

export async function waitUploadMaterialResponses(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    materials: MaterialFile[];
    triggerElementQuery: string;
}) {
    const { cms, scenarioContext, materials, triggerElementQuery } = params;
    const page = cms.page!;

    const uploadedMaterials = materials.toString();

    const isUploadedPDF = uploadedMaterials.includes('pdf');
    const isUploadedVideo = uploadedMaterials.includes('video');

    const [mediaIdsResp, resumableURL] = await Promise.all([
        waitUpsertMediaResponse(cms),

        isUploadedPDF ? waitResumableURLResponse(cms) : undefined,
        isUploadedPDF ? waitConvertMediaResponse(cms) : undefined,

        isUploadedVideo ? waitCreateBrightcoveUpload(cms) : undefined,
        isUploadedVideo ? waitFinishBrightcoveUpload(cms) : undefined,

        waitAttachMaterialResponse(cms),
        page.locator(triggerElementQuery).click(),
    ]);

    const mediaIds = await getUpsertedMediaIds(mediaIdsResp, materials.length);
    saveUploadedMaterialToContext({ scenarioContext, materials, mediaIds });
    if (resumableURL) await saveUploadedPDFUrl(scenarioContext, resumableURL);
}

export async function saveUploadedMaterialToContext(params: {
    scenarioContext: ScenarioContext;
    materials: MaterialFile[];
    mediaIds: string[];
}) {
    const { scenarioContext, materials, mediaIds } = params;

    materials.forEach((material, index) => {
        const materialId = mediaIds[index];
        scenarioContext.set(aliasMaterialId[material], materialId);
    });
}

export async function saveUploadedPDFUrl(scenarioContext: ScenarioContext, urlResponse: Response) {
    const decoderUrl = createGrpcMessageDecoder(ResumableUploadURLResponse);
    const encodedResponseTextUrl = await urlResponse.text();
    const decodedResponseUrl = decoderUrl.decodeMessage(encodedResponseTextUrl);

    const url = decodedResponseUrl?.toObject().downloadUrl || '';
    scenarioContext.set(aliasUploadedPDFUrl, url);
}

export function getMaterialChip(material: MaterialFile) {
    const materialName = getMaterialName(material);

    if (toShortenStr(materialName, 20).includes('...')) {
        return materialChipByTitle(materialName);
    }

    return materialChipByName(materialName);
}

export async function previewMaterialOnCMS(params: { cms: CMSInterface; material: MaterialFile }) {
    const { cms, material } = params;
    const page = cms.page!;

    const materialChip = getMaterialChip(material);

    if (material.includes('pdf')) {
        const [pdfPreviewPage] = await Promise.all([
            page.context().waitForEvent('page'),
            page.locator(materialChip).click(),
        ]);
        await pdfPreviewPage.waitForLoadState('networkidle');

        await delay(2000);
        await pdfPreviewPage.close();
        return;
    }

    await page.locator(materialChip).click();
    await page.waitForSelector(previewVideoContainer);
    await page.locator(closePreviewVideoDialogButton).click();
}

export async function changeToMaterialTabInLiveLesson(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    const materialTab = new ByValueKey(TeacherKeys.materialTab);
    await driver.tap(materialTab);
}

export async function previewMaterialTeacherApp(params: {
    teacher: TeacherInterface;
    material: MaterialFile;
}) {
    const { teacher, material } = params;
    const driver = teacher.flutterDriver!;

    const materialName = getMaterialName(material);

    await teacher.instruction(`Teacher preview material ${materialName}`, async function () {
        const materialItem = new ByValueKey(VirtualClassroomKeys.mediaItem(materialName, false));
        await driver.tap(materialItem);

        if (material.includes('pdf')) {
            const viewMaterialScreen = new ByValueKey(TeacherKeys.viewMaterialScreen);
            await driver.waitFor(viewMaterialScreen);
            return;
        }

        const viewMaterialScreen = new ByValueKey(TeacherKeys.videoView);
        await driver.waitFor(viewMaterialScreen);
        return;
    });
}

export async function removeMaterialChip(params: { cms: CMSInterface; material: MaterialFile }) {
    const { cms, material } = params;
    const page = cms.page!;

    const materialChip = page.locator(materialChipContainer, {
        has: page.locator(getMaterialChip(material)),
    });

    await materialChip.locator(materialRemoveIcon).click();
    await cms.selectAButtonByAriaLabel('Remove');
}

export async function assertMaterialInLiveLesson(params: {
    teacher: TeacherInterface;
    materials: MaterialFile[];
    state: MaterialFileState;
}) {
    const { teacher, materials, state } = params;
    const driver = teacher.flutterDriver!;

    await changeToMaterialTabInLiveLesson(teacher);

    for (const material of materials) {
        const materialName = getMaterialName(material);

        const materialItem = new ByValueKey(VirtualClassroomKeys.mediaItem(materialName, false));

        if (state === 'can see') {
            await driver.waitFor(materialItem);
            return;
        }

        await driver.waitForAbsent(materialItem);
    }
}

export async function assertMaterialInLessonTab(params: {
    cms: CMSInterface;
    materials: MaterialFile[];
    state: MaterialFileState;
}) {
    const { cms, materials, state } = params;
    const page = cms.page!;

    for (const material of materials) {
        const materialChip = getMaterialChip(material);

        const stateSelector: Parameters<typeof page.waitForSelector>[1]['state'] =
            state === 'can see' ? 'visible' : 'hidden';

        await page.waitForSelector(materialChip, { state: stateSelector });
    }
}

export function generateMaterialWithType(materials: string): Material.AsObject[] {
    const materialsFile: Material.AsObject[] = [];

    const materialsType = convertToMaterialType(materials);

    materialsType.forEach((materialType) => {
        const isUploadedPDF = materialType.includes('pdf');
        const isUploadedVideo = materialType.includes('video');
        if (isUploadedPDF) {
            materialsFile.push({
                mediaId: '01GJF5Q31TV8Q4K6JA30N6YAR8', //  pdf file
            });
        }
        if (isUploadedVideo) {
            materialsFile.push({
                mediaId: '01GCTEG1F4017JCX881W0V2NX7', // video file
            });
        }
    });

    return materialsFile;
}

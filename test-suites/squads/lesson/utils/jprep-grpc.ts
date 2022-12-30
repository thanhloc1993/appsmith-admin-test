import { CMSInterface } from '@supports/app-types';
import { CMSJprepPage } from '@supports/cms-jprep';

import {
    attachMaterialsToCourseYasuo,
    convertMediaBob,
    createBrightCoveUploadUrlYasuo,
    finishUploadBrightCoveYasuo,
    generateResumableUploadURLBob,
    upsertMediaBob,
} from 'test-suites/squads/lesson/common/endpoints';

export async function waitResumableURLResponse(cms: CMSInterface) {
    const jprepPage = new CMSJprepPage(cms);

    return await jprepPage.waitForGRPCResponse(generateResumableUploadURLBob, {
        timeout: 30000,
    });
}

export async function waitAttachMaterialResponse(cms: CMSInterface) {
    const jprepPage = new CMSJprepPage(cms);

    return await jprepPage.waitForGRPCResponse(attachMaterialsToCourseYasuo, {
        timeout: 30000,
    });
}

export async function waitUpsertMediaResponse(cms: CMSInterface) {
    const jprepPage = new CMSJprepPage(cms);

    return await jprepPage.waitForGRPCResponse(upsertMediaBob, {
        timeout: 30000,
    });
}

export async function waitConvertMediaResponse(cms: CMSInterface) {
    const jprepPage = new CMSJprepPage(cms);

    return await jprepPage.waitForGRPCResponse(convertMediaBob, {
        timeout: 30000,
    });
}

export async function waitCreateBrightcoveUpload(cms: CMSInterface) {
    const jprepPage = new CMSJprepPage(cms);

    return await jprepPage.waitForGRPCResponse(createBrightCoveUploadUrlYasuo, {
        timeout: 30000,
    });
}

export async function waitFinishBrightcoveUpload(cms: CMSInterface) {
    const jprepPage = new CMSJprepPage(cms);

    return await jprepPage.waitForGRPCResponse(finishUploadBrightCoveYasuo, {
        timeout: 30000,
    });
}

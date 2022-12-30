import {
    learnerProfileAliasWithAccountRoleSuffix,
    staffProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { Response, ElementHandle } from 'playwright';

import { AccountRoles, CMSInterface, IMasterWorld } from '@supports/app-types';
import { lessonLinkingWordMoreMaterial } from '@supports/constants';
import createGrpcMessageDecoder from '@supports/packages/grpc-message-decoder/grpc-message-decoder';
import { getBrightcoveVideoInfoEndpoint } from '@supports/services/grpc/constants';

import { UpsertMediaResponse } from 'manabuf/bob/v1/media_pb';
import {
    convertMedia,
    createBrightCoveUploadUrl,
    finishUploadBrightCove,
    generateResumableUploadURL,
    upsertMedia,
} from 'step-definitions/endpoints/live-lesson';
import {
    convertOneOfStringTypeToArray,
    getUserProfileFromContext,
    randomInteger,
} from 'step-definitions/utils';
import { LessonMaterialMultipleType } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';

export type StatusShareMaterialButton = 'active' | 'inactive';

export async function waitBrighcoveResponse(cms: CMSInterface) {
    return await cms.waitForGRPCResponse(getBrightcoveVideoInfoEndpoint, {
        timeout: 120000,
    });
}

export async function waitResumableURLResponse(cms: CMSInterface) {
    return await cms.waitForGRPCResponse(generateResumableUploadURL, {
        timeout: 60000,
    });
}

export async function waitUpsertMediaResponse(cms: CMSInterface) {
    return await cms.waitForGRPCResponse(upsertMedia, {
        timeout: 120000,
    });
}

export async function waitConvertMediaResponse(cms: CMSInterface) {
    return await cms.waitForGRPCResponse(convertMedia, {
        timeout: 120000,
    });
}

export async function waitCreateBrightcoveUpload(cms: CMSInterface) {
    return await cms.waitForGRPCResponse(createBrightCoveUploadUrl, {
        timeout: 120000,
    });
}

export async function waitFinishBrightcoveUpload(cms: CMSInterface) {
    return await cms.waitForGRPCResponse(finishUploadBrightCove, {
        timeout: 120000,
    });
}

export function getFileNameByFilePath(path: string) {
    return path.split('/').pop()!;
}

export async function getMediaIdsAfterSubmitLesson(
    mediaIdsResponse: Response,
    expectCount: number
): Promise<string[]> {
    const decoder = createGrpcMessageDecoder(UpsertMediaResponse);
    const encodedResponseText = await mediaIdsResponse?.text();
    const decodedResponse = decoder.decodeMessage(encodedResponseText);

    const rawMediaIds = decodedResponse?.toObject().mediaIdsList;

    let mediaIds: string[] = [];

    if (rawMediaIds) {
        mediaIds = rawMediaIds.reduce((accumulatorIds: string[], currentId) => {
            if (currentId.length > 0) {
                // We had a case that even though upload was successful, id returned = ""
                accumulatorIds.push(currentId);
            }

            return accumulatorIds;
        }, []);
    }

    weExpect(
        mediaIds.length,
        `Expect upload get ${mediaIds.length} media ids after upload`
    ).toEqual(expectCount);

    return mediaIds;
}

export function getUserIdFromRole(masterWorld: IMasterWorld, role: AccountRoles) {
    if (role.includes('student')) {
        const learner = getUserProfileFromContext(
            masterWorld.scenario,
            learnerProfileAliasWithAccountRoleSuffix(role)
        );
        return learner.id;
    } else {
        const teacher = getUserProfileFromContext(
            masterWorld.scenario,
            staffProfileAliasWithAccountRoleSuffix(role)
        );
        return teacher.id;
    }
}

export async function assertTypographyWithTooltip(
    element: ElementHandle<SVGElement | HTMLElement>,
    selector: string,
    value: string
): Promise<ElementHandle<SVGElement | HTMLElement> | null> {
    const selectorFindType = `${selector}:text-is("${value}")`;
    const isExisted = await element.$(selectorFindType);

    if (isExisted) {
        return isExisted;
    } else {
        return await element.$(`${selector}[title="${value}"]`);
    }
}

export function getRandomPollingOptionFromOptions(optionsString: string) {
    const options = convertOneOfStringTypeToArray(optionsString);
    if (options.length === 1) return optionsString[0];

    const randIndex = randomInteger(0, options.length - 1);
    return options[randIndex];
}

export async function retryHelper(params: {
    action: () => Promise<void>;
    retryCount: number;
    errorAction?: () => Promise<void>;
}) {
    const { action, retryCount, errorAction } = params;
    let tempTry = 0;
    while (tempTry < retryCount) {
        tempTry++;
        try {
            await action();
            tempTry = retryCount;
        } catch (e) {
            if (tempTry === retryCount - 1) {
                throw e;
            } else {
                if (errorAction !== null && errorAction !== undefined) {
                    await errorAction();
                }
            }
        }
    }
}

export const splitMaterialNameToMaterialArr = (
    materialNames: string
): Array<LessonMaterialMultipleType> => {
    const materialNameArr = materialNames
        .split(lessonLinkingWordMoreMaterial)
        .map((each) => (each = each.trim())) as Array<LessonMaterialMultipleType>;
    return materialNameArr;
};

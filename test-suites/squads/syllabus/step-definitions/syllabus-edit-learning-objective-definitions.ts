import { LOPlace } from '@legacy-step-definitions/types/common';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { CMSInterface, LearnerInterface, LOType, TeacherInterface } from '@supports/app-types';
import { brightCoveSampleLink, samplePDFFilePath, sampleVideoFilePath } from '@supports/constants';
import createGrpcMessageDecoder from '@supports/packages/grpc-message-decoder/grpc-message-decoder';
import { ScenarioContext } from '@supports/scenario-context';
import {
    createBrightCoveUploadUrlEndpoint,
    finishUploadBrightCoveEndpoint,
} from '@supports/services/grpc/constants';
import { ActionOptions, FileTypes } from '@supports/types/cms-types';

import { aliasLOName, aliasLOStudyGuideURL, aliasLOVideoId } from './alias-keys/syllabus';
import {
    assignmentBrightcoveUploadInput,
    brightcoveVideoPlayer,
    externalLink,
    fileIconPDF,
    fileIconVideo,
} from './cms-selectors/cms-keys';
import { loInputSelector } from './cms-selectors/learning-objective';
import { LoInfo } from './syllabus-edit-learning-objective-steps';
import { getLOTypeValue } from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';
import { CreateBrightCoveUploadUrlResponse } from 'manabuf/yasuo/v1/brightcove_pb';
import { LearningObjective } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export async function schoolAdminUpdateLOName(
    cms: CMSInterface,
    context: ScenarioContext,
    loName: string
): Promise<void> {
    await cms.instruction(
        `school admin select to edit the LO`,
        async function (this: CMSInterface) {
            await this.selectActionButton(ActionOptions.EDIT, { target: 'actionPanelTrigger' });
            const loInputValue = await this.page!.inputValue(`input${loInputSelector}`);
            weExpect(loInputValue).toEqual(loName);
        }
    );

    await cms.instruction(
        `school admin input new LO name and save to update`,
        async function (this: CMSInterface) {
            const updateName = `Updated ${loName}`;
            await this.page!.fill(`input${loInputSelector}`, updateName);
            await this.selectAButtonByAriaLabel(`Save`);
            context.set(aliasLOName, updateName);
            await this.assertThePageTitle(updateName);
        }
    );
}

export async function schoolAdminUploadLOStudyGuide(cms: CMSInterface): Promise<void> {
    await cms.instruction(
        `school admin upload pdf study guide to LO`,
        async function (this: CMSInterface) {
            await this.uploadAttachmentFiles(samplePDFFilePath, FileTypes.PDF);
        }
    );
}

export async function schoolAdminUploadLOStudyGuideWithPath(
    cms: CMSInterface,
    path: string
): Promise<void> {
    await cms.instruction(
        `school admin upload pdf study guide to LO`,
        async function (this: CMSInterface) {
            await this.uploadAttachmentFiles(path, FileTypes.PDF);
        }
    );
}

export async function schoolAdminUploadLOVideoLink(cms: CMSInterface): Promise<void> {
    await cms.instruction(
        `school admin add video file to LO by brightcove link`,
        async function (this: CMSInterface) {
            await this.page!.fill(assignmentBrightcoveUploadInput, brightCoveSampleLink);
            await this.selectAButtonByAriaLabel(`Upload`);
            await this.waitingForProgressBar();
        }
    );
}

export const schoolAdminCheckEditLOIsLegacy = (type: LOType, place: LOPlace) => {
    return type !== 'exam LO' && place === 'detail';
};

export const schoolAdminFindLOByType = (los: LearningObjective[], type: LOType) => {
    const { loTypeNumber } = getLOTypeValue({ loType: type });

    return los.find((item) => item.type === loTypeNumber) as LearningObjective;
};

export async function schoolAdminUploadLOVideoLinkWithLink(
    cms: CMSInterface,
    link: string
): Promise<void> {
    await cms.instruction(
        `school admin add video file to LO by brightcove link`,
        async function (this: CMSInterface) {
            await this.page!.fill(assignmentBrightcoveUploadInput, link);
            await this.selectAButtonByAriaLabel(`Upload`);
            await this.waitingForProgressBar();
        }
    );
}

export const schoolAdminUploadLOVideoFile = async (cms: CMSInterface) => {
    let videoId: undefined | string = undefined;
    await cms.instruction(
        `school admin add video file to LO by uploading file`,
        async function (this: CMSInterface) {
            await this.uploadAttachmentFiles(sampleVideoFilePath, FileTypes.VIDEO);

            const response = await cms.waitForGRPCResponse(createBrightCoveUploadUrlEndpoint);
            const decoder = createGrpcMessageDecoder(CreateBrightCoveUploadUrlResponse);
            const encodedResponseText = await response?.text();
            const decodedResponse = decoder.decodeMessage(encodedResponseText);
            videoId = decodedResponse?.toObject()?.videoId;

            await cms.waitForGRPCResponse(finishUploadBrightCoveEndpoint);
        }
    );

    return { videoId };
};

export async function schoolAdminSeesUpdatedLoInfo(
    cms: CMSInterface,
    context: ScenarioContext,
    loInfo: LoInfo
): Promise<void> {
    const page = cms.page!;

    switch (loInfo) {
        case 'name': {
            const loName = context.get<string>(aliasLOName);
            await cms.assertThePageTitle(loName);
            return;
        }

        case 'video': {
            // Current UX of uploading LO video file can not check by UI, already check finish upload response
            return;
        }

        case 'brightcove video': {
            await schoolAdminSeeBrightcoveVideoInLO(cms);

            const videoId = await page.$eval(brightcoveVideoPlayer, (e) =>
                e.getAttribute(`data-video-id`)
            );
            context.set(aliasLOVideoId, videoId);
            return;
        }

        case 'pdf': {
            await schoolAdminSeeStudyGuideInLO(cms);
            const studyGuide = await page.$eval(externalLink, (e) => e.getAttribute(`href`));
            context.set(aliasLOStudyGuideURL, studyGuide);
            return;
        }
    }
}

export const schoolAdminSeeBrightcoveVideoInLO = async (cms: CMSInterface) => {
    const videoFile = await cms.page!.waitForSelector(fileIconVideo);
    await videoFile.click();
    await cms.page!.waitForSelector(brightcoveVideoPlayer);
};

export const schoolAdminSeeStudyGuideInLO = async (cms: CMSInterface) => {
    await cms.page!.waitForSelector(fileIconPDF);
    await cms.page!.waitForSelector(externalLink);
};

export async function studentSeesUpdatedLoInfo(
    learner: LearnerInterface,
    context: ScenarioContext,
    loInfo: LoInfo
): Promise<void> {
    const loName = context.get<string>(aliasLOName);
    const loItemKey = new ByValueKey(SyllabusLearnerKeys.study_plan_item(loName));
    const driver = learner.flutterDriver!;

    switch (loInfo) {
        case 'name': {
            await driver.waitFor(loItemKey);
            return;
        }

        case 'video':
        case 'brightcove video': {
            await driver.tap(loItemKey);
            const video = context.get<string>(aliasLOVideoId);
            await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.brightCoveVideoIdKey(video)));
            return;
        }

        case 'pdf': {
            await driver.tap(loItemKey);
            const studyGuide = context.get<string>(aliasLOStudyGuideURL);
            await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.studyGuideURLKey(studyGuide)));
            return;
        }
    }
}

export async function teacherSeesUpdatedLoInfo(
    teacher: TeacherInterface,
    context: ScenarioContext,
    loInfo: LoInfo
): Promise<void> {
    const loName = context.get<string>(aliasLOName);
    const loItemKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanItemRow(loName));
    const driver = teacher.flutterDriver!;

    switch (loInfo) {
        case 'name': {
            await driver.waitFor(loItemKey);
            return;
        }

        case 'video':
        case 'brightcove video': {
            await driver.tap(loItemKey);
            const loVideo = context.get<string>(aliasLOVideoId);
            await driver.waitFor(new ByValueKey(SyllabusTeacherKeys.loContentPopupVideo(loVideo)));
            return;
        }

        case 'pdf': {
            await driver.tap(loItemKey);
            const studyGuide = context.get<string>(aliasLOStudyGuideURL);
            await driver.waitFor(
                new ByValueKey(SyllabusTeacherKeys.loContentPopupStudyGuide(studyGuide))
            );
            return;
        }
    }
}

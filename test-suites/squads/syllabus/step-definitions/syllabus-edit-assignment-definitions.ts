import {
    asyncForEach,
    delay,
    genId,
    parseBrightcoveVideoInfos,
    toShortenStr,
} from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { CMSInterface, LearnerInterface, TeacherInterface, Tenant } from '@supports/app-types';
import {
    brightCoveSampleLink,
    brightCoveSampleLink2,
    sampleBrightCoveName,
} from '@supports/constants';
import createGrpcMessageDecoder from '@supports/packages/grpc-message-decoder/grpc-message-decoder';
import { ScenarioContext } from '@supports/scenario-context';
import bobUploadReaderService from '@supports/services/bob-upload-reader';
import { MediaType } from '@supports/services/bob-upload-reader/request-types';
import NsEurekaAssignmentModifierServiceRequest from '@supports/services/eureka-assignment-modifier/request-types';
import { assignmentModifierService } from '@supports/services/eureka/assignment';
import { getBrightcoveVideoInfoEndpoint } from '@supports/services/grpc/constants';
import { ActionOptions, FileTypes } from '@supports/types/cms-types';

import {
    aliasAssignmentFiles,
    aliasAssignmentFilesWithTenant,
    aliasAssignmentInstruction,
    aliasAssignmentMaxGrade,
    aliasAssignmentName,
    aliasTopicName,
} from './alias-keys/syllabus';
import { assignmentMaxGradeText, assignmentInstructionText } from './cms-selectors/assignment';
import {
    assignmentBrightcoveUploadInput,
    assignmentGradingMethodText,
    assignmentIcon,
    assignmentSetting,
    fileChipName,
    loAndAssignmentByName,
} from './cms-selectors/cms-keys';
import {
    schoolAdminIsOnBookDetailsPage,
    schoolAdminUpdateAssignmentViaGrpc,
} from './syllabus-content-book-create-definitions';
import {
    schoolAdminFillGradeOfAssignmentForm,
    schoolAdminSelectGradeMethodOfAssignment,
} from './syllabus-create-assignment.definitions';
import { AssignmentInfo, AssignmentSettingInfo } from './syllabus-edit-assignment-steps';
import { schoolAdminShouldUseUpdateAssignment } from './syllabus-migration-temp';
import { studentSeeStudyPlanItem } from './syllabus-study-plan-upsert-definitions';
import { schoolAdminSeeFileIconVideo } from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';
import { GetBrightCoveVideoInfoResponse } from 'manabuf/yasuo/v1/brightcove_pb';

const sampleFiles = ['sample-pdf.pdf', 'sample-video.mp4', 'sample-audio.mp3'];
const sampleFiles2 = ['sample-pdf2.pdf', 'sample-video2.mp4', 'sample-audio2.mp3'];
const gradeMethodText = (info: AssignmentInfo) =>
    info == 'require grading' ? 'Value' : `Doesn't require grading`;

export async function schoolAdminGoesToAssignmentDetails(
    cms: CMSInterface,
    context: ScenarioContext,
    assignmentName: string
): Promise<void> {
    await cms.instruction('User goes to the book detail page', async () => {
        await schoolAdminIsOnBookDetailsPage(cms, context);
    });

    await cms.instruction('User waiting for assignment list loaded', async () => {
        await cms.page?.waitForSelector(assignmentIcon);
    });

    await cms.page?.click(loAndAssignmentByName(assignmentName));

    await cms.instruction('User waiting for assignment detail page loaded', async () => {
        await cms.waitForSkeletonLoading();
        await cms.assertThePageTitle(assignmentName);
    });
}

export async function schoolAdminSelectEditAssignment(cms: CMSInterface): Promise<void> {
    await cms.selectActionButton(ActionOptions.EDIT, { target: 'actionPanelTrigger' });
    await cms.waitingForProgressBar();
}

export async function schoolAdminUpdateAssignmentName(
    cms: CMSInterface,
    context: ScenarioContext,
    assignmentName: string
): Promise<void> {
    await cms.instruction(
        `school admin input new assignment name and save to update`,
        async function (cms) {
            const updateName = `Updated ${assignmentName}`;
            await cms.page!.fill(`#name`, updateName);
            await schoolAdminSaveChangesAssignment(cms);
            context.set(aliasAssignmentName, updateName);
        }
    );
}

export async function schoolAdminUpdateAssignmentInstruction(
    cms: CMSInterface,
    context: ScenarioContext
): Promise<void> {
    const assignmentInstruction = `Assignment Instruction ${genId()}`;

    await cms.instruction(
        `school admin input assignment instruction and save to update`,
        async function (cms) {
            await cms.page!.fill(`#instruction`, assignmentInstruction);
            await schoolAdminSaveChangesAssignment(cms);
            context.set(aliasAssignmentInstruction, assignmentInstruction);
        }
    );
}

export async function schoolAdminUpdateAssignmentGrade(
    cms: CMSInterface,
    context: ScenarioContext,
    assignmentInfo: AssignmentInfo
) {
    await schoolAdminUpdateSelectGradeMethod(cms, assignmentInfo);

    if (assignmentInfo == 'require grading') {
        await cms.instruction(
            `school admin input max grade of the assignment and save`,
            async function (cms) {
                const maxGrade = '100';
                await schoolAdminFillGradeOfAssignmentForm(cms, maxGrade);
                context.set(aliasAssignmentMaxGrade, maxGrade);
            }
        );
    }
    await schoolAdminSaveChangesAssignment(cms);
}

function schoolAdminUpdateSelectGradeMethod(cms: CMSInterface, assignmentInfo: AssignmentInfo) {
    return cms.instruction(
        'school admin select grade method in dropdown list',
        async function (cms) {
            await schoolAdminSelectGradeMethodOfAssignment(
                cms,
                assignmentInfo === 'require grading' ? 'required' : 'none'
            );
        }
    );
}

export async function schoolAdminUploadAssignmentAttachments(
    cms: CMSInterface,
    context: ScenarioContext
): Promise<void> {
    await cms.instruction(`school admin upload assignment attachments`, async function (cms) {
        const filePaths: string[] = sampleFiles.map((file) => `./assets/${file}`);

        // Upload files
        await cms.page!.setInputFiles(`input[accept="${FileTypes.ALL}"]`, filePaths);

        // Upload brightcove link
        const videoBrightcoveName = await schoolAdminUploadAssignmentBrighcoveLink(cms);

        sampleFiles.push(videoBrightcoveName);
        context.set(aliasAssignmentFiles, sampleFiles);
        await schoolAdminSaveChangesAssignment(cms);
    });
}

export async function schoolAdminUploadAssignmentAttachmentsWithTenant(
    cms: CMSInterface,
    context: ScenarioContext,
    tenant: Tenant
): Promise<void> {
    await cms.instruction(`school admin upload assignment attachments`, async function (cms) {
        const tenantSampleFiles = [...(tenant == 'Tenant S1' ? sampleFiles : sampleFiles2)];
        const filePaths: string[] = tenantSampleFiles.map((file) => `./assets/${file}`);

        // Upload files
        await cms.page!.setInputFiles(`input[accept="${FileTypes.ALL}"]`, filePaths);

        // Upload brightcove link
        const videoBrightcoveName = await schoolAdminUploadAssignmentBrighcoveLinkWithLink(
            cms,
            tenant == 'Tenant S1' ? brightCoveSampleLink : brightCoveSampleLink2
        );

        tenantSampleFiles.push(videoBrightcoveName);
        context.set(aliasAssignmentFilesWithTenant(tenant), tenantSampleFiles);
        await schoolAdminSaveChangesAssignment(cms);
    });
}

export async function schoolAdminSelectEditAssignmentSetting(
    cms: CMSInterface,
    context: ScenarioContext,
    assignmentSettingInfo: AssignmentSettingInfo
): Promise<void> {
    let dataId = '';
    switch (assignmentSettingInfo) {
        case 'Allow late submission':
            dataId = 'settings_allow_late_submission';
            break;
        case 'Allow resubmission':
            dataId = 'settings_allow_resubmission';
            break;
        case 'Require attachment submission':
            dataId = 'settings_require_attachment';
            break;
        case 'Require text note submission':
            dataId = 'settings_require_assignment_note';
            break;
        case 'Require recorded video submission':
            dataId = 'settings_require_video_submission';
            break;
    }
    await cms.page?.check(`#${dataId}`);

    if (assignmentSettingInfo === 'Require recorded video submission') {
        await cms.instruction(`school admin upload video attachment`, async function (cms) {
            const videoBrightcoveName = await schoolAdminUploadAssignmentBrighcoveLink(cms);

            await schoolAdminSeeFileIconVideo(cms);

            context.set(aliasAssignmentFiles, [videoBrightcoveName]);
            await schoolAdminSaveChangesAssignment(cms);
        });
    } else {
        await schoolAdminSaveChangesAssignment(cms);
    }
}

export async function schoolAdminSaveChangesAssignment(cms: CMSInterface) {
    await cms.selectAButtonByAriaLabel(`Save`);
    await cms.waitingForProgressBar();
}

export async function schoolAdminUploadAssignmentBrighcoveLink(
    cms: CMSInterface,
    brightCoveLink: string = brightCoveSampleLink
) {
    let videoName = '';
    await cms.instruction(
        `school admin assignment video by brightcove link ${brightCoveLink}`,
        async function (cms) {
            await cms.page!.fill(assignmentBrightcoveUploadInput, brightCoveLink);

            const [response] = await Promise.all([
                cms.waitForGRPCResponse(getBrightcoveVideoInfoEndpoint),
                cms.selectAButtonByAriaLabel('Upload'),
            ]);
            const decoder = createGrpcMessageDecoder(GetBrightCoveVideoInfoResponse);
            const encodedResponseText = await response?.text();
            const decodedResponse = decoder.decodeMessage(encodedResponseText);

            videoName = decodedResponse?.toObject()?.name ?? '';
        }
    );
    return videoName;
}

export async function schoolAdminUploadAssignmentBrighcoveLinkWithLink(
    cms: CMSInterface,
    link: string
) {
    let videoName = '';
    await cms.instruction('school admin assignment video by brightcove link', async function (cms) {
        await cms.page!.fill(assignmentBrightcoveUploadInput, link);

        const [response] = await Promise.all([
            cms.waitForGRPCResponse(getBrightcoveVideoInfoEndpoint),
            cms.selectAButtonByAriaLabel('Upload'),
        ]);

        const decoder = createGrpcMessageDecoder(GetBrightCoveVideoInfoResponse);
        const encodedResponseText = await response?.text();
        const decodedResponse = decoder.decodeMessage(encodedResponseText);

        videoName = decodedResponse?.toObject()?.name ?? '';
    });
    return videoName;
}

export async function schoolAdminSeesUpdatedAssignmentInfo(
    cms: CMSInterface,
    context: ScenarioContext,
    assignmentInfo: AssignmentInfo
): Promise<void> {
    const page = cms.page!;

    switch (assignmentInfo) {
        case 'name': {
            const assignmentName = context.get<string>(aliasAssignmentName);
            await cms.assertThePageTitle(assignmentName);
            return;
        }

        case 'instruction': {
            const assignmentInstruction = context.get<string>(aliasAssignmentInstruction);
            await page.waitForSelector(assignmentInstructionText(assignmentInstruction));
            return;
        }

        case 'require grading': {
            const assignmentMaxGrade = context.get<string>(aliasAssignmentMaxGrade);
            await page.waitForSelector(
                assignmentGradingMethodText(gradeMethodText(assignmentInfo))
            );
            await page.waitForSelector(assignmentMaxGradeText(assignmentMaxGrade));
            return;
        }

        case 'not require grading': {
            await page.waitForSelector(
                assignmentGradingMethodText(gradeMethodText(assignmentInfo))
            );
            return;
        }

        case 'attachments': {
            const attachments = context.get<string[]>(aliasAssignmentFiles);
            await page.reload();
            await asyncForEach<string, void>(attachments, async (attachment) => {
                await cms.instruction(`${attachment} should be visible`, async () => {
                    await page.waitForSelector(fileChipName(toShortenStr(attachment, 20)));
                });
            });
            return;
        }
    }
}

export async function schoolAdminSeesUpdatedAssignmentSettingInfo(
    cms: CMSInterface,
    context: ScenarioContext,
    assignmentSettingInfo: AssignmentSettingInfo
): Promise<void> {
    let selectedSetting = '';
    switch (assignmentSettingInfo) {
        case 'Allow late submission':
            selectedSetting = 'allow_late_submission';
            break;
        case 'Allow resubmission':
            selectedSetting = 'allow_resubmission';
            break;
        case 'Require attachment submission':
            selectedSetting = 'require_attachment';
            break;
        case 'Require text note submission':
            selectedSetting = 'require_assignment_note';
            break;
        case 'Require recorded video submission':
            selectedSetting = 'require_video_submission';
            break;
    }

    const setting = await cms.page!.waitForSelector(assignmentSetting(selectedSetting));

    const isSettingChecked = await setting!.isChecked();
    if (!isSettingChecked) {
        throw Error(`Setting ${assignmentSettingInfo} is not checked`);
    }
    if (assignmentSettingInfo === 'Require recorded video submission') {
        const attachments = context.get<string[]>(aliasAssignmentFiles);
        await asyncForEach<string, void>(attachments, async (attachment) => {
            await cms.instruction(`${attachment} should be visible`, async () => {
                await cms.page!.waitForSelector(fileChipName(toShortenStr(attachment, 20)));
            });
        });
    }
}

export async function studentSeesUpdatedAssignmentInfo(
    learner: LearnerInterface,
    context: ScenarioContext,
    assignmentInfo: AssignmentInfo
): Promise<void> {
    const assignmentName = context.get<string>(aliasAssignmentName);
    const topicName = context.get<string>(aliasTopicName);
    const assignmentItemKey = new ByValueKey(SyllabusLearnerKeys.study_plan_item(assignmentName));
    const driver = learner.flutterDriver!;

    await studentSeeStudyPlanItem(learner, topicName, assignmentName);

    switch (assignmentInfo) {
        case 'instruction': {
            await driver.tap(assignmentItemKey);
            const instruction = context.get<string>(aliasAssignmentInstruction);
            await driver.waitFor(
                new ByValueKey(SyllabusLearnerKeys.assignment_instruction_field_text(instruction))
            );
            return;
        }

        case 'require grading':
        case 'not require grading': {
            console.log(`Grade setting can not be seen on Learner App`);
            return;
        }

        case 'attachments': {
            await driver.tap(assignmentItemKey);
            const attachments = context.get<string[]>(aliasAssignmentFiles);
            await asyncForEach<string, void>(attachments, async (attachment) => {
                await learner.instruction(
                    `${attachment} should be visible in assignment details`,
                    async () => {
                        await driver.waitFor(new ByValueKey(attachment));
                    }
                );
            });
            return;
        }
    }
}

export async function teacherSeesUpdatedAssignmentInfo(
    teacher: TeacherInterface,
    context: ScenarioContext,
    assignmentInfo: AssignmentInfo
): Promise<void> {
    const assignmentName = context.get<string>(aliasAssignmentName);
    const driver = teacher.flutterDriver!;

    await teacherSeesAndGoesToStudyPlanItemDetails(teacher, assignmentName);

    switch (assignmentInfo) {
        case 'instruction': {
            const assignmentInstruction = context.get<string>(aliasAssignmentInstruction);
            await driver.waitFor(
                new ByValueKey(
                    SyllabusTeacherKeys.assignmentInstructionTextField(assignmentInstruction)
                )
            );
            return;
        }

        case 'require grading': {
            const assignmentMaxGrade = context.get<string>(aliasAssignmentMaxGrade);
            await driver.waitFor(new ByValueKey(SyllabusTeacherKeys.gradeTextField));
            await driver.waitFor(
                new ByValueKey(SyllabusTeacherKeys.maxGradeTextField(assignmentMaxGrade))
            );
            return;
        }

        case 'not require grading': {
            await driver.waitForAbsent(new ByValueKey(SyllabusTeacherKeys.gradeTextField));
            return;
        }

        case 'attachments': {
            const attachments = context.get<string[]>(aliasAssignmentFiles);
            await asyncForEach<string, void>(attachments, async (attachment) => {
                await teacher.instruction(
                    `${attachment} should be visible in assignment details`,
                    async () => {
                        await driver.waitFor(new ByValueKey(attachment));
                    }
                );
            });
            return;
        }
    }
}

export async function teacherSeesAndGoesToStudyPlanItemDetails(
    teacher: TeacherInterface,
    studyPlanItemName: string
) {
    const driver = teacher.flutterDriver!;

    const studyPlanListKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanScrollView);
    const studyPlanItemKey = new ByValueKey(
        SyllabusTeacherKeys.studentStudyPlanItemRow(studyPlanItemName)
    );

    try {
        await driver.waitFor(studyPlanListKey);
        await delay(3000);
        await driver.scrollUntilTap(studyPlanListKey, studyPlanItemKey, 0.0, -300, 10000);
    } catch (error) {
        throw Error(`Expect can tap item ${studyPlanItemName}`);
    }
}

export async function updateAssignmentByGRPC(
    cms: CMSInterface,
    assignment: NsEurekaAssignmentModifierServiceRequest.UpsertAssignments
) {
    const token = await cms.getToken();

    const shouldUseUpdateAssignment = await schoolAdminShouldUseUpdateAssignment();
    if (shouldUseUpdateAssignment) {
        const { assignmentId, attachmentsList, instruction, maxGrade, name, requiredGrade } =
            assignment;

        const {
            allowLateSubmission,
            allowResubmission,
            requireAttachment,
            requireAssignmentNote,
            requireVideoSubmission,
        } = assignment.setting!;

        await schoolAdminUpdateAssignmentViaGrpc(cms, {
            learningMaterialId: assignmentId,
            attachmentsList,
            instruction,
            maxGrade,
            name,
            isRequiredGrade: requiredGrade,
            allowLateSubmission,
            allowResubmission,
            requireAssignmentNote,
            requireAttachment,
            requireVideoSubmission,
        });

        return;
    }

    await assignmentModifierService.upsertAssignments(token, [assignment]);
}

export async function upsertSampleBrightCoveLinkByGRPC(cms: CMSInterface) {
    const token = await cms.getToken();
    const brightcoveVideoInfos = parseBrightcoveVideoInfos(brightCoveSampleLink);
    return await bobUploadReaderService.upsertMedia(token, [
        {
            name: sampleBrightCoveName,
            resource: brightcoveVideoInfos[0].videoId,
            type: MediaType.MEDIA_TYPE_VIDEO,
        },
    ]);
}

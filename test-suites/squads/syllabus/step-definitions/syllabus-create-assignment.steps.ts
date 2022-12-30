import { aliasAttachmentFileNames } from '@legacy-step-definitions/alias-keys/file';
import { asyncForEach, genId, getRandomElements } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { aliasAssignment, aliasTopicName } from './alias-keys/syllabus';
import {
    assignmentFormRoot,
    assignmentInstruction,
    assignmentMaxGrade,
} from './cms-selectors/assignment';
import {
    AssignmentForm,
    schoolAdminCheckAssignmentSettings,
    schoolAdminFillAssignmentForm,
    schoolAdminGetListAssignmentSettings,
    schoolAdminSeeAssignForm,
    schoolAdminSeeAssignmentGrade,
    schoolAdminSeeAssignmentInstruction,
} from './syllabus-create-assignment.definitions';
import {
    schoolAdminSelectCreateLO,
    schoolAdminSelectLOType,
} from './syllabus-create-task-assignment-definitions';
import {
    schoolAdminSaveChangesAssignment,
    schoolAdminUploadAssignmentBrighcoveLinkWithLink,
} from './syllabus-edit-assignment-definitions';
import {
    schoolAdminGetABrightCoveVideo,
    schoolAdminGetSampleFiles,
    schoolAdminSeeFileIconVideo,
    schoolAdminSeeFileMediaChip,
    schoolAdminSeesErrorMessageField,
} from './syllabus-utils';

When('school admin goes to assignment create page', async function (this: IMasterWorld) {
    const topicName = this.scenario.get(aliasTopicName);
    await schoolAdminSelectCreateLO(this.cms, topicName);

    await schoolAdminSelectLOType(this.cms, 'assignment');

    await this.cms.selectAButtonByAriaLabel(`Confirm`);

    await this.cms.waitingForLoadingIcon();

    await this.cms.instruction('school admin at create assignment page', async () => {
        await schoolAdminSeeAssignForm(this.cms);
    });
});

When(
    'school admin {string} an assignment with missing {string}',
    async function (_action: string, missingField: 'name' | 'grade') {
        const assignment: AssignmentForm = {
            name: missingField === 'name' ? '' : `Assignment ${genId()}`,
            gradeMethod: 'required',
            grade: missingField === 'grade' ? '' : '50',
        };
        await this.cms.instruction(
            `school admin fill assignment ${JSON.stringify(assignment)}`,
            async () => {
                await schoolAdminFillAssignmentForm(this.cms, assignment);
            }
        );

        await this.cms.instruction('school admin submit the assignment form', async () => {
            await schoolAdminSaveChangesAssignment(this.cms);
        });
    }
);

When(
    'school admin {string} an assignment with {string}',
    async function (
        this: IMasterWorld,
        _action: string,
        field:
            | 'description'
            | 'no description'
            | 'no require grade'
            | 'random settings'
            | 'all settings'
    ) {
        const name = `Assignment ${genId()}`;
        const instruction = field === 'no description' ? undefined : `Instruction ${genId()}`;
        const gradeMethod: AssignmentForm['gradeMethod'] =
            field === 'no require grade' ? 'none' : 'required';

        const allSettings = schoolAdminGetListAssignmentSettings();

        const settings =
            field === 'all settings'
                ? allSettings
                : field === 'random settings'
                ? getRandomElements(allSettings)
                : [];

        const assignment: AssignmentForm = {
            name,
            instruction,
            gradeMethod,
            grade: '10',
            settings,
        };

        await this.cms.instruction(
            `school admin fill assignment with ${JSON.stringify(assignment)}`,
            async () => {
                await schoolAdminFillAssignmentForm(this.cms, assignment);
            }
        );

        await this.cms.instruction('school admin submit the assignment form', async () => {
            await schoolAdminSaveChangesAssignment(this.cms);
        });

        this.scenario.set(aliasAssignment, assignment);
    }
);

Then(
    'school admin sees {string} assignment with {string} on CMS',
    async function (_action: string, _fieldCase: string) {
        const { name, instruction, gradeMethod, grade, settings } =
            this.scenario.get<AssignmentForm>(aliasAssignment);

        await this.cms.assertThePageTitle(name as string);

        await this.cms.instruction(
            `school admin ${instruction ? '' : 'not'} see instruction ${instruction}`,
            async () => {
                if (instruction) {
                    await schoolAdminSeeAssignmentInstruction(this.cms, instruction);
                    return;
                }
                await this.cms.page?.waitForSelector(assignmentInstruction, {
                    state: 'detached',
                });
            }
        );

        await this.cms.instruction(
            `school admin ${gradeMethod === 'required' ? '' : 'not'} see grade ${grade}`,
            async () => {
                if (gradeMethod === 'required') {
                    await schoolAdminSeeAssignmentGrade(this.cms, grade as string);
                    return;
                }
                await this.cms.page?.waitForSelector(assignmentMaxGrade, {
                    state: 'detached',
                });
            }
        );

        await this.cms.instruction(
            `school admin see settings ${JSON.stringify(settings)} checked`,
            async () => {
                await schoolAdminCheckAssignmentSettings(this.cms, settings || []);
            }
        );
    }
);

When(
    'school admin {string} an assignment with upload {string}',
    async function (_action: string, field: 'brightcove' | 'file') {
        await this.cms.instruction(`school admin fill assignment`, async () => {
            await schoolAdminFillAssignmentForm(this.cms, {
                name: `Assignment ${genId()}`,
                gradeMethod: 'required',
                grade: '50',
            });
        });

        if (field === 'brightcove') {
            const { src } = schoolAdminGetABrightCoveVideo();

            await this.cms.instruction(`school admin upload brightcove ${src}`, async () => {
                const videoName = await schoolAdminUploadAssignmentBrighcoveLinkWithLink(
                    this.cms,
                    src
                );
                this.scenario.set(aliasAttachmentFileNames, [videoName]);
            });

            await schoolAdminSeeFileIconVideo(this.cms);
            await schoolAdminSaveChangesAssignment(this.cms);

            return;
        }

        const { filePaths, sampleFiles } = schoolAdminGetSampleFiles();

        await this.cms.uploadAttachmentFiles(filePaths);

        this.scenario.set(aliasAttachmentFileNames, sampleFiles);

        await schoolAdminSaveChangesAssignment(this.cms);
    }
);

Then(
    'school admin sees {string} assignment with material on CMS',
    async function (_action: string) {
        const attachments = this.scenario.get<string[]>(aliasAttachmentFileNames);

        await asyncForEach<string, void>(attachments, async (attachment) => {
            await this.cms.instruction(`${attachment} should be visible`, async () => {
                await schoolAdminSeeFileMediaChip(this.cms, attachment);
            });
        });
    }
);

Then('school admin cannot {string} any assignment', async function (_action: string) {
    await this.cms.instruction(
        'school admin still see dialog upsert assignment with error message',
        async () => {
            await schoolAdminSeesErrorMessageField(this.cms, {
                wrapper: assignmentFormRoot,
            });
        }
    );
});

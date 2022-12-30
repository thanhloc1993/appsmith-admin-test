import {
    asyncForEach,
    getRandomElementsWithLength,
    toShortenStr,
} from '@legacy-step-definitions/utils';

import { CMSInterface, LOType } from '@supports/app-types';

import {
    createLoButton,
    fileChipName,
    selectTestId,
    taskAssignmentInstruction,
    taskAssignmentInstructionText,
    taskAssignmentNoAttachmentText,
    taskAssignmentRequiredItems,
    taskAssignmentRequiredItemsText,
    topicItem,
} from './cms-selectors/cms-keys';
import { getLOTypeValue } from './syllabus-utils';
import { randomInteger } from 'test-suites/squads/syllabus/utils/common';

export type TaskAssignmentInfo =
    | 'name'
    | 'description'
    | 'no description'
    | 'attachments'
    | 'no attachments'
    | 'no required items'
    | 'any required item';

export type TaskAssignmentSettingInfo =
    | 'Text note'
    | 'Duration'
    | 'Correctness'
    | 'Understanding level'
    | 'File attachment';

export const taskAssignmentSetting = {
    'Text note': 'settings_require_assignment_note',
    Duration: 'settings_require_duration',
    Correctness: 'settings_require_correctness',
    'Understanding level': 'settings_require_understanding_level',
    'File attachment': 'settings_require_attachment',
};

export const randomTaskAssignmentSettingInfos = () => {
    const allSettings: TaskAssignmentSettingInfo[] = [
        'Correctness',
        'Duration',
        'Text note',
        'Understanding level',
        'File attachment',
    ];

    return getRandomElementsWithLength(allSettings, randomInteger(1, allSettings.length));
};

export type TaskAssignmentValue = {
    name?: string;
    instruction?: string;
    setting?: TaskAssignmentSettingInfo[];
    attachments?: string[];
};

export async function schoolAdminCreateATaskAssignment(
    cms: CMSInterface,
    topicName: string,
    field: TaskAssignmentInfo,
    value: TaskAssignmentValue
) {
    await schoolAdminSelectCreateLO(cms, topicName);
    await schoolAdminSelectLOType(cms, 'task assignment');
    await cms.selectAButtonByAriaLabel(`Confirm`);

    if (value?.name) {
        await cms.page!.fill(`#name`, value?.name);

        switch (field) {
            case 'description': {
                if (value?.instruction) {
                    await cms.page!.fill(`#instruction`, value?.instruction);
                }
                break;
            }

            case 'no required items':
                await schoolAdminDeselectAllTaskAssignmentSetting(cms);
                break;

            case 'any required item': {
                if (value?.setting) {
                    await schoolAdminSelectTaskAssignmentSetting(cms, value?.setting);
                }
                break;
            }
        }
    }

    await cms.selectAButtonByAriaLabel('Save');
}

export async function schoolAdminSelectCreateLO(cms: CMSInterface, topicName: string) {
    const createLOButton = await cms
        .page!.waitForSelector(topicItem(topicName))
        .then((chapterRow) => chapterRow.waitForSelector(createLoButton));

    await createLOButton.click();
}

export async function schoolAdminSelectLOType(cms: CMSInterface, loType: LOType) {
    const { loTypeKey } = getLOTypeValue({ loType });

    await cms.selectElementByDataTestId(selectTestId);

    await cms.instruction(`School admin select ${loType}`, async () => {
        await cms.page!.click(`[data-value="${loTypeKey}"]`);
    });
}

export async function schoolAdminSelectTaskAssignmentSetting(
    cms: CMSInterface,
    setting: TaskAssignmentSettingInfo[]
) {
    const selectedSettings = setting.map((key) => taskAssignmentSetting[key]);
    await schoolAdminDeselectAllTaskAssignmentSetting(cms);
    await asyncForEach(selectedSettings, async (setting) => {
        await cms.page!.check(`#${setting}`);
    });
}

export async function schoolAdminDeselectAllTaskAssignmentSetting(cms: CMSInterface) {
    await asyncForEach(Object.values(taskAssignmentSetting), async (setting) => {
        await cms.page!.uncheck(`#${setting}`);
    });
}

export const schoolAdminSeeTaskAssignmentRequiredItemsIsEmpty = async (cms: CMSInterface) => {
    await cms.page!.waitForSelector(taskAssignmentRequiredItemsText('--'));
};

export const schoolAdminSeeTaskAssignmentRequiredItem = async (
    cms: CMSInterface,
    setting: string
) => {
    await cms.page!.waitForSelector(taskAssignmentRequiredItemsText(setting));
};

export async function schoolAdminSeesTaskAssignment(
    cms: CMSInterface,
    taskAssignmentInfo: TaskAssignmentInfo,
    value: TaskAssignmentValue
) {
    const page = cms.page!;

    switch (taskAssignmentInfo) {
        case 'name': {
            if (value?.name) {
                await cms.assertThePageTitle(value?.name);
            }
            return;
        }

        case 'description': {
            if (value?.instruction) {
                await page.waitForSelector(taskAssignmentInstructionText(value?.instruction));
            }
            return;
        }

        case 'no description': {
            await page.waitForSelector(taskAssignmentInstruction, {
                state: 'hidden',
            });
            return;
        }

        case 'no attachments': {
            await page.waitForSelector(taskAssignmentNoAttachmentText('No Information'));
            return;
        }

        case 'no required items': {
            await schoolAdminSeeTaskAssignmentRequiredItemsIsEmpty(cms);
            return;
        }

        case 'any required item': {
            if (value?.setting) {
                await asyncForEach(value?.setting, async (setting) => {
                    (await page.innerText(taskAssignmentRequiredItems)).includes(setting);
                });
            }
            return;
        }

        case 'attachments': {
            if (value?.attachments) {
                await asyncForEach(value?.attachments, async (attachment) => {
                    await cms.instruction(`${attachment} should be visible`, async () => {
                        await page.waitForSelector(fileChipName(toShortenStr(attachment, 20)));
                    });
                });
            }
            return;
        }
    }
}

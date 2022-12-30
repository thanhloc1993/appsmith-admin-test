import { Then, When } from '@cucumber/cucumber';

import { sampleAudioFilePath, sampleImageFilePath } from '@supports/constants';

import {
    schoolAdminSelectImageToolbarOfEditor,
    schoolAdminSelectAudioToolbarOfEditor,
    schoolAdminUploadMediaOfEditor,
    schoolAdminFindBlockImageInEditor,
    schoolAdminFindBlockAudioInEditor,
} from './edit-upload.definitions';
import { schoolAdminWaitingAfterUploadImageIntoEditor } from './syllabus-migration-temp';
import { schoolAdminChooseToCreateQuizWithTypeV2 } from './syllabus-question-utils';

type EditorMediaType = 'audio' | 'image';

When('school admin uploads a {string} into editor', async function (mediaType: EditorMediaType) {
    await schoolAdminChooseToCreateQuizWithTypeV2(this.cms, 'manual input');

    await this.cms.instruction(`School admin uploads ${mediaType} into editor`, async () => {
        switch (mediaType) {
            case 'image': {
                await schoolAdminSelectImageToolbarOfEditor(this.cms);
                await schoolAdminUploadMediaOfEditor(this.cms, sampleImageFilePath);

                break;
            }
            case 'audio': {
                await schoolAdminSelectAudioToolbarOfEditor(this.cms);
                await schoolAdminUploadMediaOfEditor(this.cms, sampleAudioFilePath);

                break;
            }
            default:
                throw new Error(`${mediaType} is not found`);
        }
    });

    await this.cms.waitingForLoadingIcon();
});

Then('school admin sees that {string} in editor', async function (mediaType: EditorMediaType) {
    await this.cms.instruction(`School admin sees ${mediaType} in editor`, async () => {
        switch (mediaType) {
            case 'image': {
                await schoolAdminWaitingAfterUploadImageIntoEditor();
                await schoolAdminFindBlockImageInEditor(this.cms);

                break;
            }
            case 'audio': {
                await schoolAdminFindBlockAudioInEditor(this.cms);

                break;
            }
            default:
                throw new Error(`${mediaType} is not found`);
        }
    });
});

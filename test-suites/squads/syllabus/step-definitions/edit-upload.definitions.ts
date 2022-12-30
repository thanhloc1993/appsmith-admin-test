import { CMSInterface } from '@supports/app-types';

import {
    audioToolbarEditor,
    blockAudioEditor,
    blockImageEditor,
    imageToolbarEditor,
    uploadFileInputFileDialogEditor,
} from './cms-selectors/cms-keys';

export const schoolAdminSelectImageToolbarOfEditor = async (cms: CMSInterface) => {
    await cms.page!.click(imageToolbarEditor);
};

export const schoolAdminSelectAudioToolbarOfEditor = async (cms: CMSInterface) => {
    await cms.page!.click(audioToolbarEditor);
};

export const schoolAdminFindBlockImageInEditor = async (cms: CMSInterface) => {
    return cms.page!.waitForSelector(blockImageEditor);
};

export const schoolAdminFindBlockAudioInEditor = async (cms: CMSInterface) => {
    return cms.page!.waitForSelector(blockAudioEditor);
};

export const schoolAdminUploadMediaOfEditor = async (cms: CMSInterface, filePath: string) => {
    await cms.page!.setInputFiles(uploadFileInputFileDialogEditor, filePath);
};

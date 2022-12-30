import { CMSInterface } from '@supports/app-types';

import { quizMaterialUploadInput } from './cms-selectors/syllabus';

export const schoolAdminUploadsQuizMaterial = async (cms: CMSInterface) => {
    const filePath = `./assets/syllabus-quiz-material-sample.pdf`;
    const fileName = filePath.split('/').pop()!;

    await cms.page!.setInputFiles(quizMaterialUploadInput, filePath);
    await cms.page!.waitForSelector('div.react-pdf__Page');

    return fileName;
};

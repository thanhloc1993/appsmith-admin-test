import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { CMSInterface, LearnerInterface, TeacherInterface } from '@supports/app-types';

import { tableBaseRow, imagePreviewImage } from './cms-selectors/cms-keys';
import { ByValueKey } from 'flutter-driver-x';

export const teacherSeesTermOfCardInFlashCard = async (
    teacher: TeacherInterface,
    content: string,
    index: number
) => {
    const finder = new ByValueKey(SyllabusTeacherKeys.flashCardListCardAnswer(index, content));

    await teacher.flutterDriver?.waitFor(finder);
};

export const teacherSeesDefinitionOfCardInFlashCard = async (
    teacher: TeacherInterface,
    content: string,
    index: number
) => {
    const finder = new ByValueKey(SyllabusTeacherKeys.flashCardListCardQuestion(index, content));

    await teacher.flutterDriver?.waitFor(finder);
};

export const studentSeesTermOrDefinitionOfCardInFlashCard = async (
    learner: LearnerInterface,
    field: 'term' | 'definition',
    content: string,
    index: number
) => {
    const finder = new ByValueKey(
        SyllabusLearnerKeys.flashCardItemWithContent(index, field === 'term', content)
    );

    await learner.flutterDriver?.waitFor(finder);
};

export const teacherSeesImageOfCardInFlashcard = async (
    teacher: TeacherInterface,
    imgSrc: string,
    index: number
) => {
    const imgSrcFinder = new ByValueKey(SyllabusTeacherKeys.flashCardListCardImage(index, imgSrc));

    await teacher.flutterDriver?.waitFor(imgSrcFinder);
};

export const teacherNotSeesImageOfCardInFlashcard = async (
    teacher: TeacherInterface,
    index: number
) => {
    const imgSrcFinder = new ByValueKey(SyllabusTeacherKeys.flashCardListCardImage(index, ''));

    await teacher.flutterDriver?.waitFor(imgSrcFinder);
};

export const schoolAdminGetImageOfCardInFlashcard = async (cms: CMSInterface, index: number) => {
    const cardRow = await cms.page?.waitForSelector(`${tableBaseRow}:nth-child(${index + 1})`);

    if (!cardRow) throw new Error(`Can't get card row item at index ${index}`);

    const imageElement = await cardRow.waitForSelector(`${imagePreviewImage} img`);

    const imgSrc = await imageElement.getAttribute('src');

    return imgSrc;
};

export const studentSeesImageOfCardInFlashcard = async (
    learner: LearnerInterface,
    imgSrc: string,
    index: number
) => {
    const imageFinder = new ByValueKey(SyllabusLearnerKeys.flashCardItemImage(index, imgSrc));

    await learner.flutterDriver?.waitFor(imageFinder);
};

export const studentSeesImageOfCardInLearnFlashcard = async (
    learner: LearnerInterface,
    imgSrc: string,
    index: number
) => {
    await studentSeesImageOfCardInFlashcard(learner, imgSrc, index);
};

export const studentCheckTermOrDefinitionAudioOfCardInFlashcard = async (
    learner: LearnerInterface,
    field: 'term' | 'definition',
    shouldVisible: boolean,
    index: number
) => {
    const termAudioFinder = new ByValueKey(
        SyllabusLearnerKeys.flashCardItemAudio(index, field === 'term')
    );

    if (shouldVisible) {
        await learner.flutterDriver?.waitFor(termAudioFinder);
        return;
    }

    await learner.flutterDriver?.waitForAbsent(termAudioFinder);
};

export const teacherSeesTotalCardInFlashcard = async (teacher: TeacherInterface, total: number) => {
    const totalCardsFinder = new ByValueKey(SyllabusTeacherKeys.flashCardTotalCard(total));

    await teacher.flutterDriver?.waitFor(totalCardsFinder);
};

export const studentCheckTermOrDefinitionAudioOfCardInLearnFlashcard = async (
    learner: LearnerInterface,
    field: 'term' | 'definition',
    shouldVisible: boolean,
    index: number
) => {
    await studentCheckTermOrDefinitionAudioOfCardInFlashcard(learner, field, shouldVisible, index);
};

export const studentSeesTermOrDefinitionOfCardInLearnFlashCard = async (
    learner: LearnerInterface,
    field: 'term' | 'definition',
    content: string,
    index: number
) => {
    await studentSeesTermOrDefinitionOfCardInFlashCard(learner, field, content, index);
};

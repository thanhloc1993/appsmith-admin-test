import * as CSMKeys from '@legacy-step-definitions/cms-selectors/cms-keys';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { CMSInterface, LearnerInterface } from '@supports/app-types';
import { courseModifierService } from '@supports/services/eureka/course';

import { studentNotSeeSelectBookInCourseDetail } from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';

export async function schoolAdminIsOnCoursePage(cms: CMSInterface) {
    await cms.selectMenuItemInSidebarByAriaLabel('Course');
    await cms.assertThePageTitle('Course');
}

export async function schoolAdminGoToCourseDetail(cms: CMSInterface, courseName: string) {
    await cms.instruction(`Search course ${courseName}`, async function (this: CMSInterface) {
        await this.page!.fill(CSMKeys.formFilterAdvancedTextFieldSearchInput, courseName);
        await this.page!.keyboard.press('Enter');
        await this.waitForSkeletonLoading();
    });

    await cms.instruction(`Go to course ${courseName} detail`, async function (this: CMSInterface) {
        await this.page!.click(`${CSMKeys.courseTabletCourseName}:has-text("${courseName}")`);
        await this.waitingForLoadingIcon();
    });

    await cms.assertThePageTitle(courseName);
}

export const studentSeeEmptyBook = async (learner: LearnerInterface) => {
    const finder = new ByValueKey(SyllabusLearnerKeys.chapter_with_topic_list);

    try {
        await learner.flutterDriver!.waitForAbsent(finder);
    } catch (e) {
        throw Error(`Books is displayed`);
    }
};

export const studentWaitingSelectChapterWithBookScreenLoaded = async (
    learner: LearnerInterface
) => {
    await learner.flutterDriver!.waitFor(new ByValueKey(SyllabusLearnerKeys.book_detail_screen));
};

export async function studentSeeNothingInCourse(learner: LearnerInterface) {
    await studentWaitingSelectChapterWithBookScreenLoaded(learner);

    await studentNotSeeSelectBookInCourseDetail(learner);
    await studentSeeEmptyBook(learner);
}

export async function teacherCanNotSeeBookInCourse() {
    console.log(`teacher can not see the book`);
}

export async function addBooksToCourseByGRPC(
    cms: CMSInterface,
    courseId: string,
    bookIdsList: string[]
) {
    const token = await cms.getToken();

    const { request, response } = await courseModifierService.addBooks(
        { courseId, bookIdsList },
        token
    );

    return { request, response };
}

export const schoolAdminAddBooksToCourseByCallingGRPC = async (
    cms: CMSInterface,
    courseId: string,
    bookIds: string[]
) => {
    await cms.instruction(
        `School admin adds book ${bookIds} to course ${courseId} by calling gRPC`,
        async () => {
            await addBooksToCourseByGRPC(cms, courseId, bookIds);
        }
    );
};

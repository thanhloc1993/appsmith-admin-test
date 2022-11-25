import { studentPackagesAlias } from '@user-common/alias-keys/user';
import {
    dialogWithHeaderFooterWrapper,
    dialogWithHeaderFooterButtonExit,
    dialogWithHeaderFooterButtonClose,
} from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';
import { StudentCoursePackageEntity } from '@supports/entities/student-course-package-entity';
import { ScenarioContext } from '@supports/scenario-context';

import {
    assertStudentCourseListIsEmpty,
    assertStudentCourseListToBeMatched,
    OptionCancel,
} from './user-definition-utils';

export async function discardPopupEditStudentCourse(cms: CMSInterface, button: OptionCancel) {
    await cms.instruction(
        `school admin close popup edit student course using ${button}`,
        async function (cms: CMSInterface) {
            const wrapper = cms.page!.locator(dialogWithHeaderFooterWrapper);

            switch (button) {
                case OptionCancel.Cancel: {
                    const cancelButton = wrapper.locator(dialogWithHeaderFooterButtonExit);
                    await cancelButton.click();
                    break;
                }
                case OptionCancel.ESC: {
                    await cms.page!.keyboard.press('Escape');
                    break;
                }
                case OptionCancel.X: {
                    const cancelButton = wrapper.locator(dialogWithHeaderFooterButtonClose);
                    await cancelButton.click();
                    break;
                }
            }
        }
    );
}

export async function assertStudentCourseNotChanged(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const studentPackages = scenarioContext.get<StudentCoursePackageEntity[]>(studentPackagesAlias);

    if (studentPackages && studentPackages.length > 0) {
        await assertStudentCourseListToBeMatched(cms, studentPackages);
    } else {
        await assertStudentCourseListIsEmpty(cms);
    }
}

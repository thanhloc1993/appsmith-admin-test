import { getStudyPlanNameSelector } from '@legacy-step-definitions/cms-selectors/course';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { CMSInterface, TeacherInterface } from '@supports/app-types';
import { ActionOptions } from '@supports/types/cms-types';

import { dialogWithHeaderFooter } from './cms-selectors/cms-keys';
import { ByValueKey } from 'flutter-driver-x';

export const schoolAdminNotSeeCourseStudyPlan = async (
    cms: CMSInterface,
    studyPlanName: string
) => {
    await cms.page?.waitForSelector(getStudyPlanNameSelector(studyPlanName), { state: 'detached' });
};

export const teacherNotSeeStudyPlan = async (teacher: TeacherInterface, studyPlanName: string) => {
    const finderDisabled = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanDropDownDisable);

    const isDisabled = await teacher.flutterDriver?.tap(finderDisabled);

    if (isDisabled) return;

    const studyPlanDropdown = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanDropDown);
    await teacher.flutterDriver?.tap(studyPlanDropdown);

    try {
        await teacher.flutterDriver?.waitForAbsent(
            new ByValueKey(SyllabusTeacherKeys.studentStudyPlanName(studyPlanName))
        );
    } catch (error) {
        throw new Error(`${studyPlanName} should not found but it is exist`);
    }
};

export const deleteCourseStudyPlan = async (cms: CMSInterface, studyPlanName: string) => {
    await cms.selectActionButton(ActionOptions.DELETE, {
        target: 'actionPanelTrigger',
        suffix: `:right-of(${getStudyPlanNameSelector(studyPlanName)})`,
    });

    await cms.instruction('School admin confirm to delete', async () => {
        await cms.confirmDialogAction();
    });
};

export const schoolAdminWaitingDeleteStudyPlan = async (cms: CMSInterface) => {
    await cms.page?.waitForSelector(dialogWithHeaderFooter, {
        state: 'visible',
    });
};

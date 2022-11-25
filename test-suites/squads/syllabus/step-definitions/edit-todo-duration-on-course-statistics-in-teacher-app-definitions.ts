import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { formatDate } from '@supports/utils/time/time';

import { aliasStudyPlanItemEndDate, aliasStudyPlanItemStartDate } from './alias-keys/syllabus';
import { teacherPickDateTimeOnCourseStatisticsDetail } from './edit-school-date-on-course-statistics-in-teacher-app-definitions';
import { convertStudyPlanItemTimeToTeacherUI } from './edit-study-plan-item-by-past-and-tab-definitions';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherTapsOnEditTodoDurationButton(
    teacher: TeacherInterface
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const editSchoolDate = new ByValueKey(SyllabusTeacherKeys.editStudyPlanItemTimeButton);
    await driver.waitFor(editSchoolDate);
    await driver.tap(editSchoolDate);
}

export async function teacherClearsExistingDateOnCourseStatisticsDetail(
    teacher: TeacherInterface
): Promise<void> {
    const driver = teacher.flutterDriver!;

    const startDateClearButton = new ByValueKey(
        SyllabusTeacherKeys.courseStatisticsStudyPlanItemStartDateClearIconButton
    );
    await driver.tap(startDateClearButton);

    const endDateClearButton = new ByValueKey(
        SyllabusTeacherKeys.courseStatisticsStudyPlanItemEndDateClearIconButton
    );
    await driver.tap(endDateClearButton);
}

export async function teacherEditsTodoDurationForStudents(
    teacher: TeacherInterface,
    startDate: Date,
    endDate: Date
): Promise<void> {
    const driver = teacher.flutterDriver!;

    await teacher.instruction(
        `teacher chooses clears existing date`,
        async function (this: TeacherInterface) {
            await teacherClearsExistingDateOnCourseStatisticsDetail(this);
        }
    );

    await teacher.instruction(
        `teacher chooses start date at ${formatDate(startDate, 'YYYY/MM/DD')}`,
        async function (this: TeacherInterface) {
            await teacherPickDateTimeOnCourseStatisticsDetail(this, startDate, 'start date');
        }
    );

    await teacher.instruction(
        `teacher chooses end date at ${formatDate(endDate, 'YYYY/MM/DD')}`,
        async function (this: TeacherInterface) {
            await teacherPickDateTimeOnCourseStatisticsDetail(this, endDate, 'end date');
        }
    );

    await teacher.instruction(
        `teacher presses save changes button`,
        async function (this: TeacherInterface) {
            await driver.tap(new ByValueKey(SyllabusTeacherKeys.okEditStudyPlanItemTimeButton));
        }
    );
}

export async function teacherSeesTheTodoDurationEdited(
    teacher: TeacherInterface,
    studentName: string,
    context: ScenarioContext
): Promise<void> {
    const driver = teacher.flutterDriver!;

    await teacher.instruction(
        `Teacher sees edited start and end date`,
        async function (this: TeacherInterface) {
            const editedStartDate = convertStudyPlanItemTimeToTeacherUI(
                context.get<Date>(aliasStudyPlanItemStartDate)
            );
            const editedEndDate = convertStudyPlanItemTimeToTeacherUI(
                context.get<Date>(aliasStudyPlanItemEndDate)
            );

            const studyPlanItemStartEndDateKey = new ByValueKey(
                SyllabusTeacherKeys.studyPlanItemV2StartEndDate(
                    studentName,
                    editedStartDate,
                    editedEndDate
                )
            );
            await driver.waitFor(studyPlanItemStartEndDateKey, 20000);
        }
    );
}

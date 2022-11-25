import { CMSInterface } from '@supports/app-types';

import * as LessonManagementKeys from 'step-definitions/cms-selectors/lesson-management';

export async function assertStudentOnLessonReportStudentsList(params: {
    cms: CMSInterface;
    studentName: string;
    shouldBeOnList?: boolean;
}) {
    const { cms, studentName, shouldBeOnList = true } = params;

    await cms.page!.waitForSelector(
        LessonManagementKeys.studentListItemWithStudentName(studentName),
        { state: shouldBeOnList ? 'visible' : 'hidden' }
    );
}

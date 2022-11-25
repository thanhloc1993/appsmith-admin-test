import { convertToCSVString, writeDownloadFileSync } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';
import NsMasterCourseService from '@supports/services/master-course-service/request-types';

import {
    aliasFileName,
    aliasImportedClass,
    aliasCourse,
} from 'test-suites/squads/lesson/common/alias-keys';
import {
    FileCSV,
    tabLayoutStudent,
    tableStudentName,
} from 'test-suites/squads/lesson/common/cms-selectors';
import { ClassCSV } from 'test-suites/squads/lesson/common/types';
import {
    createCSVListClass,
    openRegisterClassDialog,
    schoolAdminGoesToImportClasses,
    selectClassByName,
} from 'test-suites/squads/user-management/step-definitions/user-create-student-course-with-class.definition';
import {
    searchStudentOnCMS,
    selectOneLocation,
} from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

async function createClassCSVFile(cms: CMSInterface, context: ScenarioContext) {
    const course = context.get<NsMasterCourseService.UpsertCoursesRequest>(aliasCourse);
    const classRow: ClassCSV[] = await createCSVListClass(cms, course, ['class']);
    context.set(aliasImportedClass, classRow);

    const csv = convertToCSVString(classRow);
    const uniqueKey = new Date().getTime().toString();
    const fileName = FileCSV.STUDENT + uniqueKey + FileCSV.EXT;
    context.set(aliasFileName, fileName);

    writeDownloadFileSync(fileName, csv);
}
export async function importClassToCourse(cms: CMSInterface, context: ScenarioContext) {
    const studentInfo = context.get<UserProfileEntity>(
        learnerProfileAliasWithAccountRoleSuffix('student')
    );
    const locations = studentInfo.locations;

    await selectOneLocation(cms, locations![0].locationId);
    await createClassCSVFile(cms, context);

    const fileName = context.get(aliasFileName);
    await schoolAdminGoesToImportClasses(cms, fileName);
}

async function searchStudentByName(cms: CMSInterface, studentName: string, studentId: string) {
    // search Student
    await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
    await searchStudentOnCMS(cms, studentName);

    // select Student
    const tableStudent = await cms.waitForDataTestId('TableStudent__table');
    const newlyCreatedStudentItem = await tableStudent!.waitForSelector(
        `tr[data-value="${studentId}"]`,
        {
            timeout: 10000,
        }
    );
    const student = await newlyCreatedStudentItem.waitForSelector(tableStudentName);
    await student.click();
    await cms.waitingForLoadingIcon();
}

export async function addCourseAndClassToStudent(
    cms: CMSInterface,
    studentId: string,
    studentName: string,
    courseId: string,
    className: string
) {
    await searchStudentByName(cms, studentName, studentId);
    await cms.selectTabButtonByText(tabLayoutStudent, 'Course');
    await openRegisterClassDialog(cms, courseId);
    await selectClassByName(cms, className);
}

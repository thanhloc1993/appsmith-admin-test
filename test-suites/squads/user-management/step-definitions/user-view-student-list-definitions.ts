import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import { tableBaseRow } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { arrayHasItem, gradesCMSMap } from '@legacy-step-definitions/utils';
import {
    studentsListAlias,
    totalCountStudentListAlias,
    gradesOfStudentsListAlias,
    packagesByListStudentAlias,
    coursesListAlias,
    currentOffsetStudentsListAlias,
    currentLimitStudentsListAlias,
    learnerProfileAlias,
} from '@user-common/alias-keys/user';
import { studentTable } from '@user-common/cms-selectors/student';
import {
    tabletStudentRow,
    tableBaseFooter,
    buttonNextPageTable,
    buttonPreviousPageTable,
    tableStudentNameCell,
    tableStudentStatusCell,
    tableStudentEmailCell,
    tableStudentCourseCell,
    tableStudentGradeCell,
} from '@user-common/cms-selectors/students-page';
import { isEnabledFeatureFlag } from '@user-common/helper/feature-flag';

import { CMSInterface } from '@supports/app-types';
import { MappedLearnerProfile } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import { createARandomStudentGRPC } from './user-create-student-definitions';
import {
    convertStudentEnrollmentStatus,
    convertStudentGrade,
    mapCourses,
    mapCoursesEachUniqStudent,
} from './user-definition-utils';
import { ActionTypes, PageTypes } from './user-view-student-list-steps';

export type StudentTypes = {
    country: string;
    email: string;
    last_login_date: string;
    name: string;
    phone_number: string;
    user_id: string;
    resource_path: string;
};
export type GradeOfStudentTypes = {
    current_grade?: number | string;
    enrollment_status: string;
    student_id: string;
    grade: { name: string };
};
export type PackageByStudentTypes = {
    end_at: string;
    properties: {
        can_do_quiz: Array<string>;
        can_watch_video: Array<string>;
        can_view_study_guide: Array<string>;
        limit_online_lession: number;
    };
    start_at: string;
    student_id: string;
    student_package_id: string;
    location_ids?: string[];
};
export type CourseTypes = {
    country: string;
    course_id: string;
    display_order: number;
    grade: number;
    icon: string;
    name: string;
    school_id: number;
    subject: string;
};

export interface CourseReturnType {
    name: CourseTypes['name'];
    course_id: CourseTypes['course_id'];
    student_package_id: PackageByStudentTypes['student_package_id'];
    start_date: PackageByStudentTypes['start_at'];
    end_date: PackageByStudentTypes['end_at'];
    location_ids?: PackageByStudentTypes['location_ids'];
}
export interface CourseAndStudentTypes {
    studentId: PackageByStudentTypes['student_id'];
    courses: CourseReturnType[];
}

const waitScrollPageToBottom = async (cms: CMSInterface) => {
    await cms.page?.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
};

export const waitScrollPageToTop = async (cms: CMSInterface) => {
    await cms.page?.evaluate(() => window.scrollTo(0, 0));
};

// All Scenario:
export async function schoolAdminSeesAmountStudentsDisplayedCorrectly(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    await cms.waitForSkeletonLoading();

    const respTotalCountStudents = scenarioContext.get<number>(totalCountStudentListAlias);

    if (!respTotalCountStudents) throw Error(`Not found total count of list students`);

    const footer = await cms.page?.waitForSelector(tableBaseFooter);

    const contextFooter = await footer?.textContent();

    weExpect(contextFooter, 'student table footer contains pagination total count').toContain(
        respTotalCountStudents.toString()
    );

    await waitScrollPageToBottom(cms);
}

export const schoolAdminWaitForGetAllDataStudentsList = async (
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) => {
    await cms.page!.reload();

    const [
        resultStudentsListByFilters,
        resultGradesOfStudents,
        resultPackagesByListStudent,
        resultCountStudent,
    ] = await Promise.all([
        cms.waitForHasuraResponse('User_GetStudentListWithFilter'),
        cms.waitForHasuraResponse('User_GetGradesOfStudentsListV2'),
        cms.waitForHasuraResponse('User_StudentPackagesByListStudentIdV2'),
        cms.waitForHasuraResponse('User_CountStudentListWithFilter'),
    ]);

    let courses: CourseTypes[] = [];
    if (arrayHasItem(resultPackagesByListStudent.resp?.data?.student_packages)) {
        const resultCourses = await cms.waitForHasuraResponse('User_CoursesManyWithLocation');
        courses = resultCourses.resp?.data?.courses;
    }

    const studentsListByFilters = resultStudentsListByFilters.resp?.data?.users;
    const gradesOfStudents: GradeOfStudentTypes[] = resultGradesOfStudents.resp?.data?.students;
    const packagesByListStudent: PackageByStudentTypes[] =
        resultPackagesByListStudent.resp?.data?.student_packages;
    const countStudent = resultCountStudent.resp?.data?.users_aggregate?.aggregate?.count;

    const variables = resultStudentsListByFilters?.req?.variables;
    const { offset, limit } = variables;

    scenarioContext.set(studentsListAlias, studentsListByFilters);
    scenarioContext.set(totalCountStudentListAlias, countStudent);
    scenarioContext.set(gradesOfStudentsListAlias, gradesOfStudents);
    scenarioContext.set(packagesByListStudentAlias, packagesByListStudent);
    scenarioContext.set(coursesListAlias, courses);
    scenarioContext.set(currentOffsetStudentsListAlias, offset);
    scenarioContext.set(currentLimitStudentsListAlias, limit);

    const mappedStudentList: MappedLearnerProfile[] = studentsListByFilters.map(
        (student: StudentTypes) => {
            const studentCourseIds: string[] =
                packagesByListStudent
                    .filter((p) => p.student_id === student.user_id)
                    .map((p) => p.properties.can_do_quiz[0]) || [];

            const studentCourseNames: string[] = studentCourseIds.map((id) => {
                const courseName = courses.find((c) => c.course_id === id)?.name;
                return courseName || '';
            });

            const studentGrade = gradesOfStudents.find(
                (s) => s.student_id === student.user_id
            )?.current_grade;

            const mappedStudentGrade: string =
                gradesCMSMap[studentGrade as unknown as keyof typeof gradesCMSMap];

            return {
                id: student.user_id,
                name: student.name,
                email: student.email,
                courses: studentCourseNames,
                grade: mappedStudentGrade,
            };
        }
    );
    const mappedStudentListWithCourseAndGrade = mappedStudentList.filter(
        (student: MappedLearnerProfile) => arrayHasItem(student.courses) && student.grade
    );

    scenarioContext.set(learnerProfileAlias, mappedStudentListWithCourseAndGrade[0]);
};

export async function schoolAdminSeesCorrectStudentsInTable(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const isEnabledGradeMaster = await isEnabledFeatureFlag('STUDENT_MANAGEMENT_GRADE_MASTER');

    const students = scenarioContext.get<StudentTypes[]>(studentsListAlias);
    const studentPackages = scenarioContext.get<PackageByStudentTypes[]>(
        packagesByListStudentAlias
    );
    const courses = scenarioContext.get<CourseTypes[]>(coursesListAlias);
    const gradesOfStudents = scenarioContext.get<GradeOfStudentTypes[]>(gradesOfStudentsListAlias);

    const coursesData = mapCoursesEachUniqStudent(studentPackages, mapCourses(courses));

    const coursesMapStudent = new Map<string, CourseAndStudentTypes>();
    coursesData.forEach((course) => {
        coursesMapStudent.set(course.studentId, course);
    });

    const gradesStatusMapStudent = new Map<string, GradeOfStudentTypes | undefined>();
    students.forEach((student) => {
        const findGradesOfStudents = gradesOfStudents.find(
            (grade) => grade.student_id === student.user_id
        );
        gradesStatusMapStudent.set(student.user_id, findGradesOfStudents);
    });

    const elementRows = await Promise.all(
        students.map((student) => cms.page?.waitForSelector(tabletStudentRow(student.user_id)))
    );

    for (let index = 0; index < elementRows.length; index++) {
        const row = elementRows[index];

        const colName = await (await row?.waitForSelector(tableStudentNameCell))?.textContent();
        const colEmail = await (await row?.waitForSelector(tableStudentEmailCell))?.textContent();
        const colStatus = await (await row?.waitForSelector(tableStudentStatusCell))?.textContent();
        const colCourse = await (await row?.waitForSelector(tableStudentCourseCell))?.textContent();
        const colGrade = await (await row?.waitForSelector(tableStudentGradeCell))?.textContent();

        const student = students[index];

        //column Name and Email
        weExpect(colName, 'UI should map data student name').toContain(student.name);
        weExpect(colEmail, 'UI should map data student email').toContain(student.email);
        // column Status and Grade
        const statusAndGrade = gradesStatusMapStudent.get(student.user_id);
        weExpect(colStatus, 'UI should map data student enrollment_status').toContain(
            convertStudentEnrollmentStatus(statusAndGrade?.enrollment_status)
        );
        if (isEnabledGradeMaster) {
            weExpect(colGrade, 'UI should map data student grade').toContain(
                statusAndGrade?.grade.name
            );
        } else {
            weExpect(colGrade, 'UI should map data student current_grade').toContain(
                convertStudentGrade(statusAndGrade?.current_grade)
            );
        }
        // column Course
        const courseStudents = coursesMapStudent.get(student.user_id);
        if (courseStudents) {
            const nameCourses = courseStudents.courses.map((course) => course.name);
            nameCourses.forEach((name) => {
                weExpect(colCourse, 'UI should map data student name courses').toContain(name);
            });
            return;
        }
        weExpect(colCourse, 'UI should map data student name courses').toContain('');
    }
}

// Examples:
// | page  | action   |
// | first | previous |
// | end   | next     |

export async function shoolAdminSeesAmountStudentPagesCorrectly(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    numberPage: number
) {
    await cms.waitForSkeletonLoading();
    await waitScrollPageToBottom(cms);

    const totalCount = scenarioContext.get<number>(totalCountStudentListAlias);

    if (!totalCount) throw new Error('Not found total count students list');

    const currentLimitTimesThree =
        scenarioContext.get<number>(currentLimitStudentsListAlias) * numberPage;

    // Create more account, if current total count is not enough
    if (totalCount < currentLimitTimesThree) {
        for (let i = 0; i <= currentLimitTimesThree - totalCount; i++) {
            await createARandomStudentGRPC(cms, { studentPackageProfileLength: 1 });
        }
        return;
    }
    weExpect(totalCount, `total count was greater limited ${numberPage}`).toBeGreaterThan(
        currentLimitTimesThree
    );
}

export async function shoolAdminSeesStudentListHasManyRecords(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const tableStudent = cms.page?.locator(studentTable);
    const tableRows = tableStudent?.locator(tableBaseRow);
    const studentLength = await tableRows?.count();

    const firstGrantedLocation = scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

    if (studentLength && studentLength >= 10) {
        const { student, courses } = await createARandomStudentGRPC(cms, {
            studentPackageProfileLength: 1,
            locations: [firstGrantedLocation],
        });

        scenarioContext.set(learnerProfileAlias, {
            ...student,
            courses: courses.map((item) => item.name),
        });
    } else {
        // HARDCODE: count of many records is 10
        const manyRecords = 10;
        for (let i = 0; i < manyRecords; i++) {
            const { student, courses } = await createARandomStudentGRPC(cms, {
                studentPackageProfileLength: 1,
                locations: [firstGrantedLocation],
            });
            scenarioContext.set(learnerProfileAlias, {
                ...student,
                courses: courses.map((item) => item.name),
            });
        }
    }
}

export async function schoolAdminGoesToOtherPagesTableStudent(cms: CMSInterface, page: PageTypes) {
    const buttonPaginationTableSelector =
        page === PageTypes.FIRST ? buttonNextPageTable : buttonPreviousPageTable;

    const buttonPaginationTable = await cms.page?.waitForSelector(buttonPaginationTableSelector);

    const isDisabled = await buttonPaginationTable?.isDisabled();

    // If it is disabled, that mean that the current page is on first or end
    if (isDisabled) return;

    await cms.page?.click(buttonPaginationTableSelector);
}

enum ActionsPageLabel {
    PREVIOUS = 'Go to previous page',
    NEXT = 'Go to next page',
}
export async function schoolAdminGoesToActionPagesInTableStudent(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    action: ActionTypes,
    isSetContext = true
) {
    const labelButton =
        action === ActionTypes.PERVIOUS ? ActionsPageLabel.PREVIOUS : ActionsPageLabel.NEXT;

    // if (labelButton === ActionsPageLabel.PREVIOUS) return cms.selectAButtonByAriaLabel(labelButton);

    const [resultStudentsListByFilters, resultGradesOfStudents, resultPackagesByListStudent] =
        await Promise.all([
            cms.waitForHasuraResponse('User_GetStudentListWithFilter'),
            cms.waitForHasuraResponse('User_GetGradesOfStudentsListV2'),
            cms.waitForHasuraResponse('User_StudentPackagesByListStudentIdV2'),
            cms.selectAButtonByAriaLabel(labelButton),
        ]);

    if (isSetContext) {
        const studentsListByFilters = resultStudentsListByFilters.resp?.data?.users;
        const gradesOfStudents = resultGradesOfStudents.resp?.data?.students;
        const packagesByListStudent = resultPackagesByListStudent.resp?.data?.student_packages;

        let courses: CourseTypes[] = [];
        if (arrayHasItem(resultPackagesByListStudent.resp?.data?.student_packages)) {
            const resultCourses = await cms.waitForHasuraResponse('User_CoursesManyWithLocation');
            courses = resultCourses.resp?.data?.courses;
        }

        scenarioContext.set(studentsListAlias, studentsListByFilters);
        scenarioContext.set(gradesOfStudentsListAlias, gradesOfStudents);
        scenarioContext.set(packagesByListStudentAlias, packagesByListStudent);
        scenarioContext.set(coursesListAlias, courses);
    }
}

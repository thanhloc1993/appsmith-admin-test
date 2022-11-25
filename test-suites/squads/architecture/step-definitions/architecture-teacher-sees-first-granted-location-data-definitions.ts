import {
    aliasCourseId,
    aliasCourseName,
    aliasLessonId,
    aliasLessonName,
    aliasLocationId,
    aliasLocationName,
    aliasStudentName,
} from '@legacy-step-definitions/alias-keys/lesson';
import { createLessonManagementIndividualLessonWithGRPC } from '@legacy-step-definitions/lesson-teacher-submit-individual-lesson-report-definitions';
import { TeacherKeys } from '@legacy-step-definitions/teacher-keys/teacher-keys';

import { CMSInterface, TeacherInterface } from '@supports/app-types';
import { LocationItemCheckBoxStatus } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import { aliasFirstGrantedLocation } from './alias-keys/architecture';
import { ByValueKey } from 'flutter-driver-x';
import { createARandomStudentGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';
import { createRandomCoursesWithSpecificLocations } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

export async function teacherSeesFirstGrantedLocationOnTeacherApp(
    teacher: TeacherInterface,
    scenarioContext: ScenarioContext
) {
    const driver = teacher.flutterDriver!;

    const firstGrantedLocation = scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
    scenarioContext.set(aliasLocationId, firstGrantedLocation.locationId);

    const key = TeacherKeys.actionBarSelectedLocationFieldsKey(firstGrantedLocation.name);

    await driver.waitFor(new ByValueKey(key));
}

export async function teacherSeesCheckmarkOnFirstGrantedLocation(
    teacher: TeacherInterface,
    scenarioContext: ScenarioContext
) {
    const driver = teacher.flutterDriver!;
    const firstGrantedLocationId = scenarioContext.get(aliasLocationId);

    const locationChecked = new ByValueKey(
        TeacherKeys.locationCheckStatus(firstGrantedLocationId, LocationItemCheckBoxStatus.checked)
    );

    await driver.waitFor(locationChecked);
}

export async function teacherSeesCourseOnFirstGrantedLocation(
    teacher: TeacherInterface,
    scenarioContext: ScenarioContext
) {
    const driver = teacher.flutterDriver!;
    const courseName = scenarioContext.get(aliasCourseName);
    const key = TeacherKeys.course(courseName);
    await driver.waitFor(new ByValueKey(key));
}

export async function teacherSeesErrorMessageSnackbar(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const key = TeacherKeys.snackBar;
    await driver.waitFor(new ByValueKey(key));
}

export async function teacherSeesStudentOrLessonOnFirstGrantedLocation(
    teacher: TeacherInterface,
    scenarioContext: ScenarioContext,
    type: string
) {
    const driver = teacher.flutterDriver!;
    const lessonName = scenarioContext.get(aliasLessonName);
    const lessonId = scenarioContext.get(aliasLessonId);
    const studentName = scenarioContext.get(aliasStudentName);

    const key =
        type == 'student'
            ? TeacherKeys.student(studentName)
            : TeacherKeys.liveLessonItem(lessonId, lessonName);
    await driver.waitFor(new ByValueKey(key));
}

export async function createCoursesWithFirstGrantedLocation(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const firstGrantedLocation = scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

    const course = (
        await createRandomCoursesWithSpecificLocations(cms, { quantity: 1 }, [
            firstGrantedLocation.locationId,
        ])
    ).request[0];

    scenarioContext.set(aliasCourseName, course.name);
}

export async function createStudentWithCourseUnderFirstGrantedLocation(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const firstGrantedLocation = scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

    const result = await createARandomStudentGRPC(cms, {
        locations: [firstGrantedLocation],
        studentPackageProfileLength: 1,
    });
    scenarioContext.set(aliasStudentName, result.student.name);
    scenarioContext.set(aliasCourseName, result.courses[0].name);
    scenarioContext.set(aliasCourseId, result.courses[0].id);
}

export async function createLessonWithCourseUnderFirstGrantedLocation(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const firstGrantedLocation = scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

    scenarioContext.set(aliasLocationId, firstGrantedLocation.locationId);
    scenarioContext.set(aliasLocationName, firstGrantedLocation.name);

    await createLessonManagementIndividualLessonWithGRPC(
        cms,
        scenarioContext,
        'within 10 minutes from now'
    );
}

export async function teacherMoveToLessonOrStudentTab(teacher: TeacherInterface, type: string) {
    const driver = teacher.flutterDriver!;

    const finder = new ByValueKey(
        type == 'student' ? TeacherKeys.studentTab : TeacherKeys.lessonTab
    );
    await driver.tap(finder);
}

export async function teacherDeselectLocationsOnTeacherApp(
    teacher: TeacherInterface,
    scenarioContext: ScenarioContext
) {
    const driver = teacher.flutterDriver!;

    const firstGrantedLocation = scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

    scenarioContext.set(aliasLocationId, firstGrantedLocation.locationId);

    const listKey = new ByValueKey(TeacherKeys.locationTreeViewScrollView);

    const itemKey = new ByValueKey(
        TeacherKeys.locationCheckStatus(
            firstGrantedLocation.locationId,
            LocationItemCheckBoxStatus.checked
        )
    );

    await driver.scrollUntilVisible(listKey, itemKey, 0.0, 0.0, -100);

    await driver.tap(itemKey, 10000);
}

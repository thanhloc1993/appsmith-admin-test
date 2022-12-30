import { courseAliasWithSuffix, locationAliasWithSuffix } from '@user-common/alias-keys/user';

import { CMSInterface, Courses, Lessons, Locations, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { LocationInfoGRPC } from '@supports/types/cms-types';

import { aliasLessonId, aliasLessonIdWithSuffix, aliasLocationId } from './alias-keys/lesson';
import { teacherConfirmAcceptApplyingLocation } from './lesson-teacher-can-apply-location-in-location-settings-when-they-are-not-in-the-course-list-definitions';
import { teacherDeselectLocationsOnTeacherApp } from './lesson-teacher-sees-full-course-list-when-deselecting-location-in-location-settings-definitions';
import {
    teacherAppliesSelectedLocationOnTeacherApp,
    teacherOpenLocationFilterDialogOnTeacherApp,
    teacherSelectLocationsOnTeacherApp,
} from './lesson-teacher-sees-respective-course-after-applying-location-in-location-settings-definitions';
import {
    createLessonManagementIndividualLessonWithGRPC,
    LessonManagementCreateLessonTime,
    TeachingMedium,
} from './lesson-teacher-submit-individual-lesson-report-definitions';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import {
    pick1stElement,
    retrieveLocations,
    retrieveLowestLocations,
    splitAndCombinationIntoArray,
} from './utils';
import { ByValueKey } from 'flutter-driver-x';
import {
    createRandomCoursesWithLocations,
    getLocationAliasWithSuffix,
} from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

export async function createCourseWith2Locations(cms: CMSInterface, scenario: ScenarioContext) {
    const locations = await retrieveLowestLocations(cms);
    const location: Locations = 'location L1 & location L2';
    const course: Courses = 'course';
    const locationKeys = splitAndCombinationIntoArray(location);
    for (let index = 0; index < locationKeys.length; index++) {
        const locationKey = locationKeys[index] as Locations;
        const locationData = locations[index];
        scenario.set(locationAliasWithSuffix(locationKey), { ...locationData });
    }
    const locationsData = getLocationAliasWithSuffix(scenario, location);
    await cms.attach('Create a course by GRPC');
    const { request: courseData } = await createRandomCoursesWithLocations(cms, {
        quantity: 1,
        locations: locationsData,
    });
    scenario.set(courseAliasWithSuffix(course), {
        ...courseData[0],
    });
}

export async function createLessonWithLocation(
    cms: CMSInterface,
    scenario: ScenarioContext,
    lessons: Lessons,
    locations: Locations,
    lessonTime: LessonManagementCreateLessonTime,
    teachingMedium: TeachingMedium = 'Online'
) {
    const location: LocationInfoGRPC = scenario.get(locationAliasWithSuffix(locations));
    scenario.set(aliasLocationId, location.locationId);
    await createLessonManagementIndividualLessonWithGRPC(cms, scenario, lessonTime, teachingMedium);
    const lessonId = scenario.get(aliasLessonId);
    scenario.set(aliasLessonIdWithSuffix(lessons), lessonId);
}

export async function applyLocation(teacher: TeacherInterface, locationIdsList: string[]) {
    await teacherOpenLocationFilterDialogOnTeacherApp(teacher);
    await teacherSelectLocationsOnTeacherApp(teacher, locationIdsList);
    await teacherAppliesSelectedLocationOnTeacherApp(teacher);
}

export async function confirmApplingLocation(
    teacher: TeacherInterface,
    selectedLocationIdsList: string[],
    deselectedLocationIdsList: string[] = []
) {
    await teacherOpenLocationFilterDialogOnTeacherApp(teacher);
    await teacherDeselectLocationsOnTeacherApp(teacher, deselectedLocationIdsList);
    await teacherSelectLocationsOnTeacherApp(teacher, selectedLocationIdsList);
    await teacherConfirmAcceptApplyingLocation(teacher);
}

export async function checkLessonItemOnTeacherApp(
    teacher: TeacherInterface,
    scenario: ScenarioContext,
    lessons: Lessons
): Promise<boolean> {
    const driver = teacher.flutterDriver!;
    const lessonId = scenario.get(aliasLessonIdWithSuffix(lessons));

    try {
        await driver.waitFor(new ByValueKey(TeacherKeys.liveLessonItem(lessonId, '')));
        return true;
    } catch {
        return false;
    }
}

export async function applyParentLocationWhichNotIncludeLocation(
    cms: CMSInterface,
    teacher: TeacherInterface,
    scenario: ScenarioContext,
    locations: Locations
) {
    const locationsData = getLocationAliasWithSuffix(scenario, locations);
    const locationList = await retrieveLocations(cms);
    const parentIds = locationList
        .filter((val) => locationsData.map((val) => val.locationId).includes(val.locationId))
        .map((val) => val.parentLocationId);
    const org = locationList.find((location) => location.parentLocationId === '');
    const otherParents = locationList.filter(
        (val) => !parentIds.includes(val.locationId) && val.parentLocationId === org?.locationId
    );
    const selectedParent = pick1stElement(otherParents);
    if (selectedParent) {
        await applyLocation(teacher, [selectedParent.locationId]);
    }
}

export async function confirmApplyingParentLocationWhichIncludeLocation(
    cms: CMSInterface,
    teacher: TeacherInterface,
    scenario: ScenarioContext,
    locations: Locations
) {
    const locationsData = getLocationAliasWithSuffix(scenario, locations);
    const locationList = await retrieveLocations(cms);
    const parentIds = locationList
        .filter((val) => locationsData.map((val) => val.locationId).includes(val.locationId))
        .map((val) => val.parentLocationId);
    await confirmApplingLocation(teacher, parentIds);
}

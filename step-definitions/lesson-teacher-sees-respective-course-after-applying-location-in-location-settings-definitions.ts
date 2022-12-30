import { CMSInterface, TeacherInterface } from '@supports/app-types';
import { LocationItemCheckBoxStatus } from '@supports/enum';
import NsMasterCourseService from '@supports/services/master-course-service/request-types';
import { LocationInfoGRPC, LocationObjectGRPC } from '@supports/types/cms-types';

import {
    getLocationByName,
    oneChildLocationName,
    parentLocationName,
} from './lesson-select-and-view-location-in-location-setting-popup-navbar-definitions';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { retrieveAllChildrenLocationsOfParent, retrieveLowestLocations } from './utils';
import { ByValueKey } from 'flutter-driver-x';
import { createRandomCoursesWithSpecificLocations } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

export async function createCourseWithLocationPromise(cms: CMSInterface): Promise<{
    course: NsMasterCourseService.UpsertCoursesRequest;
    locations: LocationInfoGRPC[];
}> {
    const locationsList = await retrieveLowestLocations(cms);
    const oneChildLocation = await getLocationByName(cms, oneChildLocationName);

    const course = (
        await createRandomCoursesWithSpecificLocations(cms, { quantity: 1 }, [
            oneChildLocation!.locationId,
        ])
    ).request[0];

    return { course: course, locations: locationsList };
}

export async function createCourseWithAllChildrenLocationsOfParentPromise(
    cms: CMSInterface
): Promise<{
    course: NsMasterCourseService.UpsertCoursesRequest;
    locations: LocationInfoGRPC[];
}> {
    const parentLocation = await getLocationByName(cms, parentLocationName);

    const allChildrenLocation = await retrieveAllChildrenLocationsOfParent(
        cms,
        parentLocation!.locationId
    );

    const locationListIds = allChildrenLocation.allChildrenLocationsOfParent.map(
        (_) => _.locationId
    );

    const course = (
        await createRandomCoursesWithSpecificLocations(cms, { quantity: 1 }, locationListIds)
    ).request[0];

    return { course: course, locations: allChildrenLocation.locations };
}

export async function teacherOpenLocationFilterDialogOnTeacherApp(teacher: TeacherInterface) {
    const teacherDriver = teacher.flutterDriver!;

    await teacherDriver.tap(new ByValueKey(TeacherKeys.userProfileButton));

    await teacherDriver.waitFor(
        new ByValueKey(TeacherKeys.locationSettingProfilePopupButton),
        10000
    );

    await teacherDriver.tap(new ByValueKey(TeacherKeys.locationSettingProfilePopupButton));
}

export async function teacherSelectLocationsOnTeacherApp(
    teacher: TeacherInterface,
    locationIdList: string[]
) {
    const driver = teacher.flutterDriver!;

    const listKey = new ByValueKey(TeacherKeys.locationTreeViewScrollView);

    for (const locationId of locationIdList) {
        const itemKey = new ByValueKey(
            TeacherKeys.locationCheckStatus(locationId, LocationItemCheckBoxStatus.unCheck)
        );

        await driver.scrollUntilVisible(listKey, itemKey, 0.0, 0.0, -100, 10000);

        await driver.tap(itemKey, 10000);
    }
}

export async function teacherAppliesSelectedLocationOnTeacherApp(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    const selectLocationDialogApplyButtonKey = new ByValueKey(
        TeacherKeys.selectLocationDialogApplyButtonKey
    );

    await driver.tap(selectLocationDialogApplyButtonKey, 20000);
}

export async function teacherCancelApplySelectedLocationOnTeacherApp(
    teacher: TeacherInterface,
    cancelOption: string
) {
    const driver = teacher.flutterDriver!;

    let cancelOptionKey = TeacherKeys.selectLocationDialogCancelButtonKey;

    switch (cancelOption) {
        case 'X button':
            cancelOptionKey = TeacherKeys.selectLocationDialogCancelIconButtonKey;
            break;
        case 'cancel button':
        default:
            cancelOptionKey = TeacherKeys.selectLocationDialogCancelButtonKey;
            break;
    }

    const selectLocationDialogCancelButtonKey = new ByValueKey(cancelOptionKey);

    await driver.tap(selectLocationDialogCancelButtonKey);
}

export async function teacherConfirmCancelApplySelectedLocationOnTeacherApp(
    teacher: TeacherInterface
) {
    const driver = teacher.flutterDriver!;

    const selectLocationDialogAcceptCancellationButtonKey = new ByValueKey(
        TeacherKeys.selectLocationDialogAcceptCancellationButtonKey
    );

    await driver.tap(selectLocationDialogAcceptCancellationButtonKey);
}

export function getSelectLocationIdListByLocationsType(
    locationIdsList: string[],
    locations: LocationObjectGRPC[],
    locationsType: string
) {
    let selectLocationIdList: string[] = locationIdsList;

    switch (locationsType) {
        case 'one child location of parent':
        case 'all child locations of parent':
            break;
        case 'one parent': {
            const childLocation = locations.filter(
                (location) => location.locationId === locationIdsList[0]
            )[0];
            selectLocationIdList = locations
                .filter((location) => location.locationId === childLocation.parentLocationId)
                .map((_) => _.locationId);
            break;
        }
        default:
            throw 'school admin has created a new course with type location not correct';
    }

    return selectLocationIdList;
}

export async function teacherSeesLocationsNameUnderTeachersNameByLocationOrderOnTeacherApp(
    teacher: TeacherInterface,
    locationIdsList: string[],
    locations: LocationObjectGRPC[],
    locationsOrder: string
) {
    const driver = teacher.flutterDriver!;

    const locationId = locationIdsList[0];

    const childLocation = locations.find((location) => location.locationId === locationId)!;
    // const childLocationName = childLocation?.name ?? '';

    const numberOfRemainedChild = locationIdsList.length - 1;

    const parentLocationName = getParentLocationNameOfChildrenByLocationOrder(
        locations,
        childLocation,
        locationsOrder
    );

    const prefix = parentLocationName.length > 0 ? `${parentLocationName} • ` : '';
    // Plus one its own location
    const suffix = numberOfRemainedChild > 0 ? `(+${numberOfRemainedChild + 1})` : '';
    // Hardcode here due to force auto select first location
    const key = TeacherKeys.actionBarSelectedLocationFieldsKey(
        `${prefix}center E2E 1659126327316${suffix}`
    );
    // const key = TeacherKeys.actionBarSelectedLocationFieldsKey(
    //     `${prefix}${childLocationName}${suffix}`
    // );

    await driver.waitFor(new ByValueKey(key));
}

function getParentLocationNameOfChildrenByLocationOrder(
    locations: LocationObjectGRPC[],
    childLocation: LocationObjectGRPC,
    locationsOrder: string
): string {
    let parentLocationName = '';
    switch (locationsOrder) {
        case 'one child':
        case 'one smallest id child location along with number of remained child':
            break;
        case 'one parent location and one smallest id child location along with number of remained child': {
            const parentLocation = locations.filter(
                (location) => location.locationId === childLocation.parentLocationId
            )[0];
            parentLocationName = parentLocation.name;
            break;
        }
        default:
            throw '"teacher" sees "<order>" location name under teacher name on Teacher App not correct';
    }
    return parentLocationName;
}

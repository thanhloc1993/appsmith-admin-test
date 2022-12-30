import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld, AccountRoles } from '@supports/app-types';
import NsMasterCourseService from '@supports/services/master-course-service/request-types';
import { LocationInfoGRPC, LocationObjectGRPC } from '@supports/types/cms-types';

import {
    aliasCourseId,
    aliasCourseName,
    aliasLocationIdsList,
    aliasLocationsList,
} from './alias-keys/lesson';
import {
    createCourseWithLocationPromise,
    createCourseWithAllChildrenLocationsOfParentPromise,
    teacherAppliesSelectedLocationOnTeacherApp,
    teacherOpenLocationFilterDialogOnTeacherApp,
    teacherSelectLocationsOnTeacherApp,
    getSelectLocationIdListByLocationsType,
    teacherSeesLocationsNameUnderTeachersNameByLocationOrderOnTeacherApp,
    teacherCancelApplySelectedLocationOnTeacherApp,
    teacherConfirmCancelApplySelectedLocationOnTeacherApp,
} from './lesson-teacher-sees-respective-course-after-applying-location-in-location-settings-definitions';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { getTeacherInterfaceFromRole } from './utils';
import { ByValueKey } from 'flutter-driver-x';

Given(
    'school admin has created a new course with {string} location',
    async function (this: IMasterWorld, locationsType: string) {
        const cms = this.cms;
        const scenario = this.scenario;

        await cms.instruction(
            `school admin has created a new course with ${locationsType} location`,
            async function () {
                let result: {
                    course: NsMasterCourseService.UpsertCoursesRequest;
                    locations: LocationInfoGRPC[];
                };

                switch (locationsType) {
                    case 'one child location of parent':
                        result = await createCourseWithLocationPromise(cms);
                        break;
                    case 'all child locations of parent':
                    case 'one parent':
                        result = await createCourseWithAllChildrenLocationsOfParentPromise(cms);
                        break;
                    default:
                        throw 'school admin has created a new course with type location not correct';
                }

                scenario.set(aliasLocationIdsList, result.course.locationIdsList);
                scenario.set(aliasCourseId, result.course.id);
                scenario.set(aliasCourseName, result.course.name);
                scenario.set(aliasLocationsList, result.locations);
            }
        );
    }
);

When(
    '{string} applies {string} location in location settings on Teacher App',
    async function (this: IMasterWorld, teacherRole: AccountRoles, locationsType: string) {
        const scenario = this.scenario;
        const teacherInterface = getTeacherInterfaceFromRole(this, teacherRole);
        const locationIdsList = scenario.get<Array<string>>(aliasLocationIdsList);
        const locations = scenario.get<LocationObjectGRPC[]>(aliasLocationsList);

        const selectLocationIdsList = getSelectLocationIdListByLocationsType(
            locationIdsList,
            locations,
            locationsType
        );

        await teacherInterface.instruction(
            `${teacherRole} applies ${locationsType} location in location settings on Teacher App`,
            async function () {
                await teacherOpenLocationFilterDialogOnTeacherApp(teacherInterface);
                await teacherSelectLocationsOnTeacherApp(teacherInterface, selectLocationIdsList);
                await teacherAppliesSelectedLocationOnTeacherApp(teacherInterface);
            }
        );
    }
);

Then(
    `{string} sees course which has location is included in selected location settings`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const driver = teacher.flutterDriver!;
        const scenario = this.scenario;
        await teacher.instruction(
            `${role} sees course which has location is included in selected location settings`,
            async function () {
                const key = TeacherKeys.course(scenario.get(aliasCourseName));
                await driver.waitFor(new ByValueKey(key), 10000);
            }
        );
    }
);

Then(
    `{string} sees {string} location name under teacher's name on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles, locationsOrder: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        const locations = scenario.get<LocationObjectGRPC[]>(aliasLocationsList);
        const locationIdsList = scenario.get<Array<string>>(aliasLocationIdsList);

        await teacher.instruction(
            `${role} sees ${locationsOrder} location name under teacher's name on Teacher App`,
            async function () {
                await teacherSeesLocationsNameUnderTeachersNameByLocationOrderOnTeacherApp(
                    teacher,
                    locationIdsList,
                    locations,
                    locationsOrder
                );
            }
        );
    }
);

Given(
    '{string} has selected {string} location in location settings on Teacher App',
    async function (this: IMasterWorld, teacherRole: AccountRoles, locationsType: string) {
        const scenario = this.scenario;
        const teacherInterface = getTeacherInterfaceFromRole(this, teacherRole);
        const locationIdsList = scenario.get<Array<string>>(aliasLocationIdsList);
        const locations = scenario.get<LocationObjectGRPC[]>(aliasLocationsList);

        await teacherInterface.instruction(
            `${teacherRole} has selected ${locationsType} location in location settings on Teacher App`,
            async function () {
                const selectLocationIdsList = getSelectLocationIdListByLocationsType(
                    locationIdsList,
                    locations,
                    locationsType
                );

                await teacherOpenLocationFilterDialogOnTeacherApp(teacherInterface);
                await teacherSelectLocationsOnTeacherApp(teacherInterface, selectLocationIdsList);
            }
        );
    }
);

Given(
    '{string} has cancelled applying location in location settings by {string}',
    async function (this: IMasterWorld, teacherRole: AccountRoles, cancelOption: string) {
        const teacherInterface = getTeacherInterfaceFromRole(this, teacherRole);

        await teacherInterface.instruction(
            `${teacherRole} has cancelled applying location in location settings by ${cancelOption}`,
            async function () {
                await teacherCancelApplySelectedLocationOnTeacherApp(
                    teacherInterface,
                    cancelOption
                );
            }
        );
    }
);

When(
    '{string} confirms to cancel applying location in location settings',
    async function (this: IMasterWorld, teacherRole: AccountRoles) {
        const teacherInterface = getTeacherInterfaceFromRole(this, teacherRole);

        await teacherInterface.instruction(
            `${teacherRole} confirms to cancel applying location in location settings`,
            async function () {
                await teacherConfirmCancelApplySelectedLocationOnTeacherApp(teacherInterface);
            }
        );
    }
);

Then(
    `{string} does not see any location name under teacher's name on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const driver = teacher.flutterDriver!;

        const key = TeacherKeys.actionBarSelectedLocationFieldsKey('');

        await teacher.instruction(
            `${role}does not see any location name under teacher's name on Teacher App`,
            async function () {
                await driver.waitForAbsent(new ByValueKey(key));
            }
        );
    }
);

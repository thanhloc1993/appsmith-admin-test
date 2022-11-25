import { Given, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import { aliasLocationIdsList, aliasLocationsList } from './alias-keys/lesson';
import { teacherDeselectLocationsOnTeacherApp } from './lesson-teacher-sees-full-course-list-when-deselecting-location-in-location-settings-definitions';
import {
    getSelectLocationIdListByLocationsType,
    teacherOpenLocationFilterDialogOnTeacherApp,
    teacherSelectLocationsOnTeacherApp,
    teacherAppliesSelectedLocationOnTeacherApp,
    teacherCancelApplySelectedLocationOnTeacherApp,
    teacherConfirmCancelApplySelectedLocationOnTeacherApp,
} from './lesson-teacher-sees-respective-course-after-applying-location-in-location-settings-definitions';
import { getTeacherInterfaceFromRole } from './utils';

Given(
    '{string} has applied {string} location in location settings on Teacher App',
    async function (role: AccountRoles, locationsType: string) {
        const scenario = this.scenario;
        const teacher = getTeacherInterfaceFromRole(this, role);
        const locationIdsList = scenario.get<Array<string>>(aliasLocationIdsList);
        const locations = scenario.get<LocationObjectGRPC[]>(aliasLocationsList);

        const selectLocationIdsList = getSelectLocationIdListByLocationsType(
            locationIdsList,
            locations,
            locationsType
        );

        await teacher.instruction(
            `${role} has applied ${locationsType} location in location settings on Teacher App`,
            async function () {
                await teacherOpenLocationFilterDialogOnTeacherApp(teacher);
                await teacherSelectLocationsOnTeacherApp(teacher, selectLocationIdsList);
                await teacherAppliesSelectedLocationOnTeacherApp(teacher);
            }
        );
    }
);

When(
    '{string} deselects and applies {string} location in location settings on Teacher App',
    async function (role: AccountRoles, locationsType: string) {
        const scenario = this.scenario;
        const teacher = getTeacherInterfaceFromRole(this, role);
        const locationIdsList = scenario.get<Array<string>>(aliasLocationIdsList);
        const locations = scenario.get<LocationObjectGRPC[]>(aliasLocationsList);

        const deselectLocationIdsList = getSelectLocationIdListByLocationsType(
            locationIdsList,
            locations,
            locationsType
        );

        await teacher.instruction(
            `${role} deselects and applies ${locationsType} location in location settings on Teacher App`,
            async function () {
                await teacherOpenLocationFilterDialogOnTeacherApp(teacher);
                await teacherDeselectLocationsOnTeacherApp(teacher, deselectLocationIdsList);
                await teacherAppliesSelectedLocationOnTeacherApp(teacher);
            }
        );
    }
);

When(
    '{string} discards deselecting {string} location in location settings by {string}',
    async function (role: AccountRoles, locationsType: string, cancelOption: string) {
        const scenario = this.scenario;
        const teacher = getTeacherInterfaceFromRole(this, role);
        const locationIdsList = scenario.get<Array<string>>(aliasLocationIdsList);
        const locations = scenario.get<LocationObjectGRPC[]>(aliasLocationsList);

        const deselectLocationIdsList = getSelectLocationIdListByLocationsType(
            locationIdsList,
            locations,
            locationsType
        );

        await teacher.instruction(
            `${role} discards deselecting ${locationsType} location in location settings by ${cancelOption}`,
            async function () {
                await teacherOpenLocationFilterDialogOnTeacherApp(teacher);
                await teacherDeselectLocationsOnTeacherApp(teacher, deselectLocationIdsList);
                await teacherCancelApplySelectedLocationOnTeacherApp(teacher, cancelOption);
                await teacherConfirmCancelApplySelectedLocationOnTeacherApp(teacher);
            }
        );
    }
);

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import { aliasLocationIdsList, aliasLocationsList } from './alias-keys/lesson';
import {
    teacherConfirmAcceptApplyingLocation,
    teacherIsRedirectToTheCourseListPageOnTeacherApp,
    teacherIsStayAtCourseDetailScreenOnTeacherApp,
} from './lesson-teacher-can-apply-location-in-location-settings-when-they-are-not-in-the-course-list-definitions';
import {
    getSelectLocationIdListByLocationsType,
    teacherCancelApplySelectedLocationOnTeacherApp,
    teacherConfirmCancelApplySelectedLocationOnTeacherApp,
    teacherOpenLocationFilterDialogOnTeacherApp,
    teacherSelectLocationsOnTeacherApp,
} from './lesson-teacher-sees-respective-course-after-applying-location-in-location-settings-definitions';
import { getTeacherInterfaceFromRole } from './utils';

When(
    '{string} confirms applying {string} location in location settings on Teacher App',
    async function (role: AccountRoles, locationsType: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        const scenario = this.scenario;
        const locationIdsList = scenario.get<Array<string>>(aliasLocationIdsList);
        const locations = scenario.get<LocationObjectGRPC[]>(aliasLocationsList);

        const selectLocationIdsList = getSelectLocationIdListByLocationsType(
            locationIdsList,
            locations,
            locationsType
        );

        await teacher.instruction(
            `${role} confirms applying ${locationsType} location in location settings on Teacher App`,
            async function () {
                await teacherOpenLocationFilterDialogOnTeacherApp(teacher);
                await teacherSelectLocationsOnTeacherApp(teacher, selectLocationIdsList);
                await teacherConfirmAcceptApplyingLocation(teacher);
            }
        );
    }
);

When(
    '{string} discards applying {string} location in location settings on Teacher App by {string}',
    async function (role: AccountRoles, locationsType: string, cancelOption: string) {
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
            `${role} discards applying ${locationsType} location in location settings on Teacher App by ${cancelOption}`,
            async function () {
                await teacherOpenLocationFilterDialogOnTeacherApp(teacher);
                await teacherSelectLocationsOnTeacherApp(teacher, selectLocationIdsList);
                await teacherCancelApplySelectedLocationOnTeacherApp(teacher, cancelOption);
                await teacherConfirmCancelApplySelectedLocationOnTeacherApp(teacher);
            }
        );
    }
);

Then('{string} is still in detail course page', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);

    await teacher.instruction(`${role} is still in detail course page`, async function () {
        await teacherIsStayAtCourseDetailScreenOnTeacherApp(teacher);
    });
});

Then(
    '{string} is redirected to the course list page on Teacher App',
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} is redirected to the course list page on Teacher App`,
            async function () {
                await teacherIsRedirectToTheCourseListPageOnTeacherApp(teacher);
            }
        );
    }
);

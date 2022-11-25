import { aliasLocationId } from '@legacy-step-definitions/alias-keys/lesson';
import { isCombinationWithAnd, splitAndCombinationIntoArray } from '@legacy-step-definitions/utils';
import {
    courseAliasWithSuffix,
    courseLocationsAliasWithSuffix,
    learnerProfileAlias,
    learnerProfileAliasWithAccountRoleSuffix,
    locationAliasWithSuffix,
    studentListAlias,
    studentLocationsAlias,
} from '@user-common/alias-keys/user';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, Classes, Courses, IMasterWorld, Locations } from '@supports/app-types';
import { CourseEntityWithLocation } from '@supports/entities/course-entity';
import { CourseResult, CourseStatus } from '@supports/entities/course-status';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { LocationInfoGRPC } from '@supports/types/cms-types';

import {
    openRegisterClassDialog,
    selectClassByName,
} from './user-create-student-course-with-class.definition';
import { verifyStudentCourseTable } from './user-create-student-course-with-location.definition';
import {
    createAStudentPromise,
    schoolAdminCreateNewStudent,
    teacherSelectsCourseLocationOnTeacherApp,
} from './user-create-student-definitions';
import {
    createRandomCoursesWithLocations,
    createStudentCourse,
    getCourseAliasWithSuffix,
    getLocationAliasWithSuffix,
    gotoEditStudentCourse,
    pressBackButtonTeacherApp,
} from './user-definition-utils';
import { clickAddCourseButton } from './user-student-course-common-definitions';
import {
    verifyNewlyCourseOnTeacherApp,
    verifyNewlyLearnerOnTeacherApp,
    viewCourseOnLearnerApp,
} from './user-view-course-definitions';
import uniq from 'lodash/uniq';
import { RetrieveLowestLevelLocationsResponse } from 'manabuf/bob/v1/masterdata_pb';
import { learnerNotSeeNewCourse } from 'test-suites/common/step-definitions/course-definitions';
import { aliasStudentsByClass } from 'test-suites/squads/syllabus/step-definitions/alias-keys/syllabus';

Given(
    'school admin has created a student belong to {string}',
    async function (this: IMasterWorld, location: Locations) {
        const cms = this.cms;
        const context = this.scenario;
        const locationLength = isCombinationWithAnd(location)
            ? splitAndCombinationIntoArray(location).length
            : 1;
        await cms.attach(`Create ${locationLength} student(s) by GRPC`);

        const studentData = await createAStudentPromise(cms, { locationLength });
        context.set(learnerProfileAlias, studentData);

        const { locations } = studentData;

        if (!locations || !locations.length) {
            throw Error('Cannot create Student with location');
        }

        context.set(studentLocationsAlias, locations);

        if (!isCombinationWithAnd(location)) {
            const locationData = locations[0];
            context.set(locationAliasWithSuffix(location), { ...locationData });
            context.set(aliasLocationId, locationData.locationId);
        } else {
            const locationKeys = splitAndCombinationIntoArray(location);
            for (let index = 0; index < locationKeys.length; index++) {
                const locationKey = locationKeys[index] as Locations;
                const locationData = locations[index];
                context.set(locationAliasWithSuffix(locationKey), { ...locationData });
            }
        }
    }
);

Given(
    'school admin has created a student {string} belong to {string}',
    async function (this: IMasterWorld, studentRoles: AccountRoles, location: Locations) {
        const cms = this.cms;
        const context = this.scenario;
        const locationLength = isCombinationWithAnd(location)
            ? splitAndCombinationIntoArray(location).length
            : 1;
        await cms.attach(`Create ${locationLength} student(s) by GRPC`);

        const locationList =
            context.get<RetrieveLowestLevelLocationsResponse.Location.AsObject[]>(
                studentLocationsAlias
            );

        const studentData = await schoolAdminCreateNewStudent(cms, context, 1, locationList);
        const studentList = context.get<AccountRoles[]>(studentListAlias) ?? ([] as AccountRoles[]);
        studentList.push(studentRoles);
        context.set(studentListAlias, studentList);
        context.set(studentRoles, studentData.student);
        context.set(learnerProfileAliasWithAccountRoleSuffix(studentRoles), studentData.student);

        const { locations } = studentData.student;

        if (!locations || !locations.length) {
            throw Error('Cannot create Student with location');
        }

        if (!isCombinationWithAnd(location)) {
            const locationData = locations[0];
            context.set(locationAliasWithSuffix(location), { ...locationData });
            context.set(aliasLocationId, locationData.locationId);
        } else {
            const locationKeys = splitAndCombinationIntoArray(location);
            for (let index = 0; index < locationKeys.length; index++) {
                const locationKey = locationKeys[index] as Locations;
                const locationData = locations[index];
                context.set(locationAliasWithSuffix(locationKey), { ...locationData });
            }
        }
    }
);

Given(
    'school admin has created a {string} belong to {string}',
    async function (this: IMasterWorld, courses: Courses, locations: Locations) {
        const cms = this.cms;
        const context = this.scenario;

        const courseKeys = splitAndCombinationIntoArray(courses) as Courses[];
        const locationsData = getLocationAliasWithSuffix(context, locations);

        for (const course of courseKeys) {
            await cms.attach('Create a course by GRPC');
            const { request: courseData } = await createRandomCoursesWithLocations(cms, {
                quantity: 1,
                locations: locationsData,
            });

            context.set(courseAliasWithSuffix(course), {
                ...courseData[0],
            });
            context.set(courseLocationsAliasWithSuffix(course), locationsData);
        }
    }
);

When(
    'school admin adds the {string} for {string} with {string} and {string}',
    async function (
        courses: Courses,
        accountRoles: AccountRoles,
        location: Locations,
        classCourseName: Classes
    ) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const studentListByClass =
            scenarioContext.get<AccountRoles[]>(aliasStudentsByClass(classCourseName)) ??
            ([] as string[]);

        const student = scenarioContext.get<UserProfileEntity>(accountRoles);

        studentListByClass.push(accountRoles);
        scenarioContext.set(aliasStudentsByClass(classCourseName), studentListByClass);

        await cms.instruction('school admin goes to edit student course', async function () {
            await gotoEditStudentCourse(cms, student);
        });

        const courseData = getCourseAliasWithSuffix(scenarioContext, courses);
        for (const course of courseData) {
            const locationData = scenarioContext.get<LocationInfoGRPC>(
                locationAliasWithSuffix(location)
            );

            await createStudentCourse(cms, scenarioContext, {
                courseStatus: 'available',
                courseId: course.id,
                courseName: course.name,
                location: locationData,
            });
        }

        await cms.instruction('school admin saves the upsert course process', async function () {
            await cms.selectElementWithinWrapper(
                studentPageSelectors.dialogWithHeaderFooterWrapper,
                studentPageSelectors.footerDialogConfirmButtonSave
            );
            await cms.page?.waitForSelector(studentPageSelectors.upsertCourseInfoDialog, {
                state: 'hidden',
            });
            await cms.waitForSkeletonLoading();
        });
        for (const course of courseData) {
            await cms.instruction(
                `school admin register ${classCourseName} of ${course}`,
                async function () {
                    await openRegisterClassDialog(cms, course.id);
                    await selectClassByName(cms, classCourseName);
                }
            );
        }
    }
);

When('school admin wants to add a new student-course', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenarioContext = this.scenario;

    const student = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

    await gotoEditStudentCourse(cms, student);
});

When('school admin adds a new student-course record', async function (this: IMasterWorld) {
    const cms = this.cms;

    await clickAddCourseButton(cms);
});

When(
    'school admin adds a new {string} {string} with {string}',
    async function (
        this: IMasterWorld,
        courseStatus: CourseStatus,
        courses: Courses,
        location: Locations
    ) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const courseData = getCourseAliasWithSuffix(scenarioContext, courses);
        for (const course of courseData) {
            const locationData = scenarioContext.get<LocationInfoGRPC>(
                locationAliasWithSuffix(location)
            );

            await createStudentCourse(cms, scenarioContext, {
                courseStatus,
                courseId: course.id,
                courseName: course.name,
                location: locationData,
            });
        }
        await cms.instruction('school admin saves the upsert course process', async function () {
            await cms.selectElementWithinWrapper(
                studentPageSelectors.dialogWithHeaderFooterWrapper,
                studentPageSelectors.footerDialogConfirmButtonSave
            );
            await cms.page?.waitForSelector(studentPageSelectors.upsertCourseInfoDialog, {
                state: 'hidden',
            });
            await cms.waitForSkeletonLoading();
        });
    }
);

When('school admin saves the process', async function (this: IMasterWorld) {
    const cms = this.cms;

    await cms.instruction('school admin saves the upsert course process', async function () {
        await cms.selectElementWithinWrapper(
            studentPageSelectors.dialogWithHeaderFooterWrapper,
            studentPageSelectors.footerDialogConfirmButtonSave
        );
        await cms.page?.waitForSelector(studentPageSelectors.upsertCourseInfoDialog, {
            state: 'hidden',
        });
        await cms.waitForSkeletonLoading();
    });
});

Then(
    'school admin sees the {string} with {string} added for the student',
    async function (this: IMasterWorld, courses: Courses, location: Locations) {
        const cms = this.cms;
        const context = this.scenario;

        const courseData = getCourseAliasWithSuffix(context, courses);
        for (const course of courseData) {
            const locationData = context.get<LocationInfoGRPC>(locationAliasWithSuffix(location));

            await cms.instruction(
                `Verify course: ${course.name} with location: ${locationData.name}`,
                async function () {
                    await verifyStudentCourseTable(
                        cms,
                        course.id,
                        course.name,
                        locationData.name,
                        ''
                    );
                }
            );
        }
    }
);

Then(
    'teacher sees the {string} on Teacher App',
    async function (this: IMasterWorld, course: Courses) {
        const teacher = this.teacher;
        const scenarioContext = this.scenario;

        const coursesData = [];
        let locationData: LocationInfoGRPC[] = [];

        if (!isCombinationWithAnd(course)) {
            const courseData = scenarioContext.get<CourseEntityWithLocation>(
                courseAliasWithSuffix(course)
            );
            coursesData.push(courseData);

            const locations = scenarioContext.get<LocationInfoGRPC[]>(
                courseLocationsAliasWithSuffix(course)
            );
            if (locations && locations.length > 0) {
                locationData = [...locationData, ...locations];
            }
        } else {
            const courseKeys = splitAndCombinationIntoArray(course) as Courses[];
            courseKeys.forEach((courseKey) => {
                const courseData = scenarioContext.get<CourseEntityWithLocation>(
                    courseAliasWithSuffix(courseKey)
                );
                coursesData.push(courseData);
                const locations = scenarioContext.get<LocationInfoGRPC[]>(
                    courseLocationsAliasWithSuffix(courseKey)
                );
                if (locations && locations.length > 0) {
                    locationData = [...locationData, ...locations];
                }
            });
        }

        const locationIds = uniq(locationData.map((item) => item.locationId));

        await teacher.instruction(
            'teacher selects course location on location setting',
            async function () {
                await teacherSelectsCourseLocationOnTeacherApp(teacher, locationIds);
            }
        );

        for (const courseData of coursesData) {
            await verifyNewlyCourseOnTeacherApp(teacher, courseData.id, courseData.name);
            await pressBackButtonTeacherApp(teacher);
        }
    }
);

Then(
    'teacher sees the student in the {string} on Teacher App',
    async function (this: IMasterWorld, course: Courses) {
        const teacher = this.teacher;
        const scenarioContext = this.scenario;

        const courseData = scenarioContext.get<CourseEntityWithLocation>(
            courseAliasWithSuffix(course)
        );
        const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

        await verifyNewlyLearnerOnTeacherApp(
            teacher,
            learnerProfile,
            courseData.id,
            courseData.name
        );
        await pressBackButtonTeacherApp(teacher);
    }
);

Then(
    'student {string} the {string} on Learner App',
    async function (this: IMasterWorld, courseResult: CourseResult, course: Courses) {
        const learner = this.learner;
        const context = this.scenario;

        const courseData = context.get<CourseEntityWithLocation>(courseAliasWithSuffix(course));

        if (courseResult === 'does not see') {
            await learner.instruction(
                `Student can not see the new course ${courseData.name}`,
                async () => await learnerNotSeeNewCourse(learner, courseData.name)
            );
        } else {
            await viewCourseOnLearnerApp(learner, courseData.name);
        }
    }
);

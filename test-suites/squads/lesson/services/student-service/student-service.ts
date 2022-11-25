import { arrayHasItem, retrieveLowestLocations } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { AccountRoles, CMSInterface, Tenant } from '@supports/app-types';
import { MasterCategory } from '@supports/enum';
import {
    Lesson_ClassManyByLocationIdAndCourseIdAndNameQuery,
    Lesson_ClassManyByLocationIdAndCourseIdAndNameQueryVariables,
} from '@supports/graphql/bob/bob-types';
import bobClassQueries from '@supports/graphql/bob/class.query';
import { ScenarioContext } from '@supports/scenario-context';
import masterCourseService from '@supports/services/master-course-service';
import mastermgmtImportService from '@supports/services/mastermgmt-import-service';
import { ImportClassData } from '@supports/services/mastermgmt-import-service/types';
import { usermgmtUserModifierService } from '@supports/services/usermgmt-student-service';
import { LocationInfoGRPC } from '@supports/types/cms-types';

import { CreateStudentResponse } from 'manabuf/usermgmt/v2/users_pb';
import {
    aliasClassId,
    aliasClassName,
    aliasCourseId,
    aliasCourseIdByStudent,
    aliasCourseName,
    aliasLocationId,
    aliasLocationIdWithTenant,
    aliasLocationName,
    aliasLocationNameWithTenant,
} from 'test-suites/squads/lesson/common/alias-keys';
import {
    createStudentRequest,
    studentPackageProfileRequest,
    upsertCourseRequest,
} from 'test-suites/squads/lesson/services/student-service/student-service-requests';
import {
    ClassHasura,
    StudentWithPackage,
} from 'test-suites/squads/lesson/services/student-service/types';
import { retry } from 'ts-retry-promise';

export async function getLocation(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    tenant?: Tenant;
    isAddNewLocation?: boolean;
    indexOfGetLocation?: number;
}): Promise<LocationInfoGRPC> {
    const { cms, scenarioContext, tenant, isAddNewLocation, indexOfGetLocation = 0 } = params;

    const locationIdAliasKey = tenant ? aliasLocationIdWithTenant(tenant) : aliasLocationId;
    const locationNameAliasKey = tenant ? aliasLocationNameWithTenant(tenant) : aliasLocationName;

    const locationIdFromContext = scenarioContext.get(locationIdAliasKey);
    const locationNameFromContext = scenarioContext.get(locationNameAliasKey);

    if (isAddNewLocation || !locationIdFromContext || !locationNameFromContext) {
        const locationsListFromAPI = await retrieveLowestLocations(cms);
        if (!arrayHasItem(locationsListFromAPI)) throw Error('There are no locations from API');

        return locationsListFromAPI[indexOfGetLocation];
    }

    return {
        locationId: locationIdFromContext,
        name: locationNameFromContext,
    };
}

export async function importClass(params: {
    cms: CMSInterface;
    courseId: string;
    locationId: string;
    className: string;
}) {
    const { cms, courseId, locationId, className } = params;

    const cmsToken = await cms.getToken();

    const payload: ImportClassData = {
        course_id: courseId,
        location_id: locationId,
        course_name: '',
        location_name: '',
        class_name: className,
    };

    await cms.attach('School admin imports class data');

    await retry(
        async function () {
            await mastermgmtImportService.importBobData(cmsToken, MasterCategory.Class, payload);
        },
        { retries: 2, delay: 1000 }
    ).catch(function (reason) {
        throw Error(`Import class data failed: ${JSON.stringify(reason)}`);
    });
}

async function getOneClassInCourseOfLocation(params: {
    cms: CMSInterface;
    variables: Lesson_ClassManyByLocationIdAndCourseIdAndNameQueryVariables;
}): Promise<ClassHasura | undefined> {
    const { cms, variables } = params;

    const resp =
        await cms.graphqlClient?.callGqlBob<Lesson_ClassManyByLocationIdAndCourseIdAndNameQuery>({
            body: bobClassQueries.getClassesInCourseOfLocation(variables),
        });

    if (!resp?.data?.class) {
        throw Error(
            `Can not get class with course_id (${variables.course_id}) and location_id (${variables.location_id})`
        );
    }

    return resp.data.class[0];
}

async function createSampleStudent(params: { cms: CMSInterface; locationIds: string[] }) {
    const { cms, locationIds } = params;

    const token = await cms.getToken();
    const createStudentReq = await createStudentRequest({ cms, locationIds });
    const { response } = await usermgmtUserModifierService.createStudent(token, createStudentReq);

    if (!response) {
        throw Error('Create student failed');
    }

    return response;
}

async function getStudentPackage(params: {
    cms: CMSInterface;
    studentInfo: CreateStudentResponse.AsObject;
}) {
    const { cms, studentInfo } = params;

    const token = await cms.getToken();

    const userProfile = studentInfo.studentProfile?.student?.userProfile;
    if (!userProfile) throw Error("There is no student's information");

    const locationIds = userProfile.locationIdsList;

    const course = await upsertCourseRequest({ cms, locationIds });
    await masterCourseService.upsertCourses(token, [course]);

    const courseId = course.id;
    const locationId = locationIds[0];

    await importClass({ cms, courseId, locationId, className: `Class E2E ${courseId}` });

    const classHasura = await getOneClassInCourseOfLocation({
        cms,
        variables: { course_id: courseId, location_id: locationId },
    });

    if (!classHasura)
        throw Error(`Can not get class by course_id (${courseId}) and location_id ${locationId}`);

    return {
        course,
        userProfile,
        classHasura,
        locationId,
    };
}

async function addStudentPackage(params: {
    cms: CMSInterface;
    studentId: string;
    locationId: string;
    courseId: string;
    classId: string;
}) {
    const { cms, studentId, courseId, locationId, classId } = params;
    const token = await cms.getToken();

    const studentPackage = await studentPackageProfileRequest({
        cms,
        locationId,
        courseId,
        classId,
    });

    await usermgmtUserModifierService.upsertStudentCoursePackageReq(token, {
        studentId,
        studentPackages: [studentPackage],
    });
}

export async function createSampleStudentWithPackage(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    studentRole: AccountRoles;
    tenant?: Tenant;
    isAddNewLocation?: boolean;
    indexOfGetLocation?: number;
}): Promise<StudentWithPackage> {
    const {
        cms,
        scenarioContext,
        studentRole,
        tenant,
        isAddNewLocation,
        indexOfGetLocation = 0,
    } = params;

    const location = await getLocation({
        cms,
        scenarioContext,
        tenant,
        isAddNewLocation,
        indexOfGetLocation,
    });
    const { locationId, name: locationName } = location;

    const locationIds = [location.locationId];

    const studentInfo = await createSampleStudent({ cms, locationIds });
    const { course, classHasura } = await getStudentPackage({ cms, studentInfo });

    await addStudentPackage({
        cms,
        studentId: studentInfo.studentProfile?.student?.userProfile?.userId || '',
        courseId: course.id,
        locationId,
        classId: classHasura.class_id,
    });

    const studentProfile = studentInfo!.studentProfile!;
    const userProfile = studentProfile!.student!.userProfile!;

    const data: StudentWithPackage = {
        student: {
            avatar: '',
            phoneNumber: '',
            email: userProfile.email,
            givenName: userProfile.givenName,
            id: userProfile.userId,
            name: userProfile.name,
            locations: [location],
            password: studentProfile.studentPassword,
            gradeValue: studentInfo!.studentProfile?.student?.grade,
            gradeMaster: {
                grade_id: studentProfile!.student!.gradeId,
                name: '',
                partner_internal_id: '',
            },
        },
        course: { courseId: course.id, name: course.name },
        location,
        classHasura,
    };

    scenarioContext.set(learnerProfileAliasWithAccountRoleSuffix(studentRole), data.student);

    scenarioContext.set(aliasLocationId, locationId);
    scenarioContext.set(aliasLocationName, locationName);

    if (tenant) {
        scenarioContext.set(aliasLocationIdWithTenant(tenant), locationId);
        scenarioContext.set(aliasLocationNameWithTenant(tenant), locationName);
    }

    const { id: courseId, name: courseName } = course;
    scenarioContext.set(aliasCourseId, courseId);
    scenarioContext.set(aliasCourseName, courseName);
    scenarioContext.set(aliasCourseIdByStudent(data.student.id), course.id);

    const { class_id, name: className } = classHasura;
    scenarioContext.set(aliasClassId, class_id);
    scenarioContext.set(aliasClassName, className);

    return data;
}

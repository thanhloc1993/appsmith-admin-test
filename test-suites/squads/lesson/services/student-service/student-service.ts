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
    aliasStudentByClassId,
} from 'test-suites/squads/lesson/common/alias-keys';
import {
    createStudentRequest,
    studentPackageProfileRequest,
    upsertCourseRequest,
} from 'test-suites/squads/lesson/services/student-service/student-service-requests';
import {
    ClassHasura,
    CourseDuration,
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

    const result: LocationInfoGRPC = {
        locationId: '',
        name: '',
    };

    if (isAddNewLocation || !locationIdFromContext || !locationNameFromContext) {
        const locationsListFromAPI = await retrieveLowestLocations(cms);
        if (!arrayHasItem(locationsListFromAPI)) throw Error('There are no locations from API');

        const { locationId, name } = locationsListFromAPI[indexOfGetLocation];
        result.locationId = locationId;
        result.name = name;
    } else {
        result.locationId = locationIdFromContext;
        result.name = locationNameFromContext;
    }

    scenarioContext.set(aliasLocationId, result.locationId);
    scenarioContext.set(aliasLocationName, result.name);

    if (tenant) {
        scenarioContext.set(aliasLocationIdWithTenant(tenant), result.locationId);
        scenarioContext.set(aliasLocationNameWithTenant(tenant), result.name);
    }

    return result;
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

export async function createSampleStudent(params: { cms: CMSInterface; locationIds: string[] }) {
    const { cms, locationIds } = params;

    const token = await cms.getToken();
    const createStudentReq = await createStudentRequest({ cms, locationIds });
    const { response } = await usermgmtUserModifierService.createStudent(token, createStudentReq);

    if (!response) {
        throw Error('Create student failed');
    }

    return response;
}

export async function createStudentPackage(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    locationId: string;
}) {
    const { cms, scenarioContext, locationId } = params;

    const token = await cms.getToken();

    const course = await upsertCourseRequest({ cms, locationIds: [locationId] });
    await masterCourseService.upsertCourses(token, [course]);

    const { id: courseId, name: courseName } = course;

    await importClass({ cms, courseId, locationId, className: `Class E2E ${courseId}` });

    const classHasura = await getOneClassInCourseOfLocation({
        cms,
        variables: { course_id: courseId, location_id: locationId },
    });

    if (!classHasura)
        throw Error(`Can not get class by course_id (${courseId}) and location_id ${locationId}`);

    scenarioContext.set(aliasCourseId, courseId);
    scenarioContext.set(aliasCourseName, courseName);

    const { class_id, name: className } = classHasura;
    scenarioContext.set(aliasClassId, class_id);
    scenarioContext.set(aliasClassName, className);

    return {
        course,
        classHasura,
    };
}

export async function addStudentPackage(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    studentId: string;
    locationId: string;
    courseId: string;
    classId: string;
    courseDuration?: CourseDuration;
}) {
    const { cms, scenarioContext, studentId, courseId, locationId, classId, courseDuration } =
        params;
    const token = await cms.getToken();

    const studentPackage = await studentPackageProfileRequest({
        cms,
        scenarioContext,
        locationId,
        courseId,
        classId,
        courseDuration,
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
    courseDuration?: CourseDuration;
}): Promise<StudentWithPackage> {
    const {
        cms,
        scenarioContext,
        studentRole,
        tenant,
        isAddNewLocation,
        indexOfGetLocation = 0,
        courseDuration,
    } = params;

    const location = await getLocation({
        cms,
        scenarioContext,
        tenant,
        isAddNewLocation,
        indexOfGetLocation,
    });
    const { locationId } = location;

    const locationIds = [location.locationId];

    const studentInfo = await createSampleStudent({ cms, locationIds });
    const { course, classHasura } = await createStudentPackage({
        cms,
        scenarioContext,
        locationId,
    });

    await addStudentPackage({
        cms,
        scenarioContext,
        studentId: studentInfo.studentProfile?.student?.userProfile?.userId || '',
        courseId: course.id,
        locationId,
        classId: classHasura.class_id,
        courseDuration,
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
    scenarioContext.set(aliasCourseIdByStudent(data.student.id), course.id);
    scenarioContext.set(aliasStudentByClassId(classHasura.class_id), data.student);

    return data;
}

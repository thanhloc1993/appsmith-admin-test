import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    aliasClassId,
    aliasCourseEndDate,
    aliasCourseId,
    aliasCourseStartDate,
} from 'test-suites/squads/lesson/common/alias-keys';
import { lessonDateV3 } from 'test-suites/squads/lesson/common/cms-selectors';
import { UserProfileEntity } from 'test-suites/squads/lesson/common/lesson-profile-entity';
import { LessonTimeValueType, MethodSavingType } from 'test-suites/squads/lesson/common/types';
import {
    addStudentPackage,
    createSampleStudent,
    getLocation,
} from 'test-suites/squads/lesson/services/student-service/student-service';
import { CourseDuration } from 'test-suites/squads/lesson/services/student-service/types';
import {
    changeLessonTimeToMorning,
    createSampleTeacherForCreateLesson,
    openCreateLessonPage,
    selectTeachingMethod,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { changeDatePickerByDateRange } from 'test-suites/squads/lesson/utils/date-picker';
import {
    searchTeacherV3,
    selectCenterByNameV3,
    selectClassByNameWithoutAutoAllocate,
    selectCourseByNameV3,
    selectLessonDateByLessonTime,
    selectTeacher,
    setupRecurringSetting,
} from 'test-suites/squads/lesson/utils/lesson-upsert';

export async function fillLessonDateByCourseDuration(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    courseDuration: CourseDuration;
}) {
    const { cms, scenarioContext, courseDuration } = params;

    const courseStartDate = scenarioContext.get<Date>(aliasCourseStartDate);
    const courseEndDate = scenarioContext.get<Date>(aliasCourseEndDate);

    let desiredStartDate = courseStartDate;

    let dateRange = 0;

    switch (courseDuration) {
        case 'start date < lesson date < end date':
        case 'within 30 days since now':
            dateRange = 1;
            break;

        case 'end date = lesson date':
            desiredStartDate = courseEndDate;
            break;
    }

    await changeDatePickerByDateRange({
        cms,
        currentDate: desiredStartDate,
        datePickerSelector: lessonDateV3,
        dateRange,
    });
}

export async function fillTeacherIndependent(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    teacherName?: string;
}) {
    const { cms, scenarioContext, teacherName } = params;

    let willBeChosenTeacherName = teacherName;

    if (!willBeChosenTeacherName) {
        const { name: teacherName } = await createSampleTeacherForCreateLesson(
            cms,
            scenarioContext
        );

        willBeChosenTeacherName = teacherName;
    }

    await searchTeacherV3(cms, willBeChosenTeacherName);
    await selectTeacher(cms, willBeChosenTeacherName);
}

export async function fillLessonForAutoAllocate(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    teacherName?: string;
    lessonTime: LessonTimeValueType;
    lessonMethodSaving: MethodSavingType;
    locationName: string;
    courseName: string;
    className: string;
}) {
    const {
        cms,
        scenarioContext,
        teacherName,
        lessonTime,
        lessonMethodSaving,
        locationName,
        courseName,
        className,
    } = params;

    await cms.selectMenuItemInSidebarByAriaLabel('Lesson Management');
    await openCreateLessonPage(cms);

    await cms.instruction('Select lesson time', async function () {
        await selectLessonDateByLessonTime({ cms, scenarioContext, lessonTime });
        await changeLessonTimeToMorning(cms);
    });

    await cms.instruction('Select group teacher method', async function () {
        await selectTeachingMethod(cms, 'LESSON_TEACHING_METHOD_GROUP');
    });

    await cms.instruction('Select teacher', async function () {
        await fillTeacherIndependent({ cms, scenarioContext, teacherName });
    });

    await cms.instruction('Select location, course and class', async function () {
        await selectCenterByNameV3(cms, locationName);
        await selectCourseByNameV3(cms, courseName);
        await selectClassByNameWithoutAutoAllocate(cms, className);
    });

    await cms.instruction('Select recurring setting', async function () {
        await setupRecurringSetting({ cms, scenarioContext, methodSaving: lessonMethodSaving });
    });
}

export async function createStudentWithAvailablePackage(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    studentRole: AccountRoles;
    courseDuration: CourseDuration;
}) {
    const { cms, scenarioContext, studentRole, courseDuration } = params;

    const location = await getLocation({
        cms,
        scenarioContext,
    });

    const locationId = location.locationId;

    const courseId = scenarioContext.get(aliasCourseId);
    const classId = scenarioContext.get(aliasClassId);

    const studentInfo = await createSampleStudent({ cms, locationIds: [locationId] });

    const studentProfile = studentInfo!.studentProfile!;
    const userProfile = studentProfile!.student!.userProfile!;

    const studentId = userProfile.userId;
    const studentName = userProfile.name;

    if (!studentId || !studentName) throw new Error('There is no student info');

    await addStudentPackage({
        cms,
        scenarioContext,
        studentId,
        courseId,
        locationId,
        classId,
        courseDuration,
    });

    const studentData: UserProfileEntity = {
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
    };

    scenarioContext.set(learnerProfileAliasWithAccountRoleSuffix(studentRole), studentData);
}

import { LearnerKeys } from '@common/learner-key';
import { TeacherKeys } from '@common/teacher-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';
import { CourseDuration } from '@supports/entities/course-duration';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { verifyNeverLoggedInTagOnTeacherWeb } from './user-never-logged-in-tag-definitions';
import { NeverLoggedInTagCondition } from './user-view-student-details-definitions';
import { strictEqual } from 'assert';
import { ByValueKey } from 'flutter-driver-x';
import { teacherGenCourseDetailUrl } from 'test-suites/common/step-definitions/course-definitions';

///  Examples:
// | condition                              | result       |
// | start date <= current date <= end date | sees         |
// | start date > current date              | does not see |
// | end date < current date                | does not see |
export type CourseResult = 'sees' | 'does not see';

export async function viewCourseOnLearnerApp(
    learner: LearnerInterface,
    courseName: string,
    courseDuration: CourseDuration | undefined = undefined,
    courseAvatar?: string
) {
    let instructionSuffix = '';
    if (courseDuration !== undefined) {
        instructionSuffix = `when ${courseName} has ${courseDuration}`;
    }

    const driver = learner.flutterDriver!;

    const courseFinder = new ByValueKey(LearnerKeys.course(courseName));
    await learner.instruction(
        `Find course ${courseName} in Learner App ${instructionSuffix}`,
        async function () {
            await driver.waitFor(courseFinder);
        }
    );

    if (courseAvatar !== undefined && courseAvatar !== null) {
        await learner.instruction(`Verify course avatar ${courseAvatar} `, async function () {
            const courseAvatarFinder = new ByValueKey(LearnerKeys.courseAvatar(courseAvatar));
            await driver.waitFor(courseAvatarFinder);
        });
    }

    await learner.instruction(`Go to course details: ${courseName}`, async function () {
        await driver.tap(courseFinder);
    });

    await learner.instruction(
        `Verify course name: ${courseName} in course details`,
        async function () {
            const appBarFinder = new ByValueKey(LearnerKeys.app_bar);
            const courseNameOnUI = await driver.getText(appBarFinder);

            strictEqual(
                courseNameOnUI,
                courseName,
                'Course name should be match in course details screen'
            );
        }
    );

    await learner.instruction(`Back to home screen`, async function () {
        const backButtonFinder = new ByValueKey(LearnerKeys.back_button);

        await driver.tap(backButtonFinder);
    });
}

export async function cannotViewCourseOnLearnerApp(learner: LearnerInterface, courseName: string) {
    const driver = learner.flutterDriver!;

    const courseFinder = new ByValueKey(LearnerKeys.course(courseName));
    await learner.instruction(`Cannot find course ${courseName} in Learner App`, async function () {
        await driver.waitForAbsent(courseFinder);
    });
}

export async function findCourseOnTeacherHomePage(
    teacher: TeacherInterface,
    courseName: string,
    courseAvatar?: string
) {
    const driver = teacher.flutterDriver!;
    const origin = await teacher.flutterDriver?.webDriver?.getUrlOrigin();

    await teacher.flutterDriver?.webDriver?.page.goto(origin!);
    await driver.reload();

    const courseFinder = new ByValueKey(TeacherKeys.course(courseName));
    const courseListFinder = new ByValueKey(TeacherKeys.courseScrollView);

    await teacher.instruction(`Find course ${courseName} `, async function () {
        try {
            await driver.waitFor(courseListFinder, 20000);
            await driver.scrollUntilVisible(courseListFinder, courseFinder, 0.0, 0.0, -100, 20000);
        } catch (error) {
            await driver.waitFor(courseFinder, 10000);
        }
    });

    if (courseAvatar !== undefined && courseAvatar !== null) {
        await teacher.instruction(`Verify course avatar ${courseAvatar} `, async function () {
            const courseAvatarFinder = new ByValueKey(TeacherKeys.courseAvatarKey(courseAvatar));
            await driver.waitFor(courseAvatarFinder);
        });
    }
}

export async function verifyNewlyCourseOnTeacherApp(
    teacher: TeacherInterface,
    courseId: string,
    courseName: string,
    courseAvatar?: string
) {
    const driver = teacher.flutterDriver!;

    await findCourseOnTeacherHomePage(teacher, courseName, courseAvatar);

    const courseFinder = new ByValueKey(TeacherKeys.course(courseName));

    await teacher.instruction(`Go to course details: ${courseName}`, async function () {
        try {
            await driver.tap(courseFinder, 20000);
        } catch (error) {
            const url = await teacherGenCourseDetailUrl(teacher, courseId);
            await teacher.flutterDriver?.webDriver?.page.goto(url);
        }
    });

    await teacher.instruction(
        `Verify course name ${courseName} in Course details page`,
        async function () {
            const courseInCourseDetailsFinder = new ByValueKey(TeacherKeys.course(courseName));
            await driver.waitFor(courseInCourseDetailsFinder);
        }
    );
}

export async function verifyNewlyLearnerOnTeacherApp(
    teacher: TeacherInterface,
    learnerProfile: UserProfileEntity,
    courseId: string,
    courseName: string,
    courseAvatar?: string,
    neverLoggedInTagCondition: NeverLoggedInTagCondition = {
        shouldVerifyNeverLoggedInTag: false,
        hasLoggedInTag: false,
    }
) {
    const driver = teacher.flutterDriver!;

    await verifyNewlyCourseOnTeacherApp(teacher, courseId, courseName, courseAvatar);

    /// TODO: Add check Study plan tab
    await teacher.instruction(`Tap on Student tab`, async function () {
        const studentTabFinder = new ByValueKey(TeacherKeys.studentTab);

        await driver.tap(studentTabFinder);
    });

    await teacher.instruction(
        `Verify student ${learnerProfile.name} in Student list`,
        async function () {
            await teacher.instruction(
                `Verify student name: ${learnerProfile.name}`,
                async function () {
                    const studentFinder = new ByValueKey(TeacherKeys.student(learnerProfile.name));

                    await driver.waitFor(studentFinder);
                }
            );

            await teacher.instruction(
                `Verify student avatar: ${learnerProfile.avatar}`,
                async function () {
                    const avatarFinder = new ByValueKey(
                        TeacherKeys.studentAvatarWidget(learnerProfile.avatar)
                    );
                    await driver.waitFor(avatarFinder);
                }
            );

            if (neverLoggedInTagCondition.shouldVerifyNeverLoggedInTag) {
                await verifyNeverLoggedInTagOnTeacherWeb(
                    teacher,
                    learnerProfile.name,
                    'Student Tab in Course Details',
                    neverLoggedInTagCondition.hasLoggedInTag
                );
            }
        }
    );
}

export async function goToStudentInformationFromCourseDetails(
    teacher: TeacherInterface,
    learnerName: string
) {
    const driver = teacher.flutterDriver!;

    await teacher.instruction(`Go to Student Information ${learnerName}`, async function () {
        const studentFinder = new ByValueKey(TeacherKeys.student(learnerName));
        await driver.tap(studentFinder);
    });
}

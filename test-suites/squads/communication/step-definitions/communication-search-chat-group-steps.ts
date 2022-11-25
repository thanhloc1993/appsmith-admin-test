import {
    getRandomElement,
    getStudentIdFromContextWithAccountRole,
    getTeacherInterfaceFromRole,
    getUserIdFromContextWithAccountRole,
    getUserProfileFromContext,
    isParentRole,
} from '@legacy-step-definitions/utils';
import {
    courseListAliasWithAccountRoleSuffix,
    learnerProfileAliasWithAccountRoleSuffix,
    parentProfilesAliasWithAccountRoleSuffix,
    studentCoursePackageListAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld, AccountRoles, TeacherInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    aliasChatGroupCourseIdC1,
    aliasChatGroupCourseIdC2,
    aliasChatGroupCourseNameC1,
    aliasChatGroupCourseNameC2,
    aliasContactFilter,
    aliasCourseFilter,
    aliasMessageTypeFilter,
    aliasPartialName,
    aliasSearchConversationType,
    aliasStudentName,
} from './alias-keys/communication';
import { aliasMessageType, messageContentKey } from './alias-keys/communication';
import {
    CourseFilter,
    CourseRoles,
    getRandomCourseFilter,
    teacherNotSeeParentGroupChat,
    teacherNotSeeStudentGroupChat,
    teacherTapApplyFilterButton,
    teacherTapFilterIconButton,
} from './communication-common-definitions';
import {
    ContactFilter,
    MessageType,
    MessageTypeFilter,
    teacherFilterContact,
    teacherFilterMessageType,
    teacherSeeParentGroupChat,
    teacherSeeStudentGroupChat,
    teacherSelectConversation,
    teacherSelectedJoinedTab,
} from './communication-common-definitions';
import {
    teacherNotSeesReplyStatus,
    teacherSeesReplyStatus,
} from './communication-read-and-reply-message-definitions';
import {
    cmsUpdateStudentWithRandomName,
    createStudentWithParent,
    teacherEnterSearchTextInConversationBar,
    teacherFilterConversationByCourseIds,
} from './communication-search-chat-group-definitions';
import { teacherSeesMessageIsSent } from './communication-send-message-definitions';
import { teacherSendMessageWithType } from './communication-send-receive-message-definitions';
import { UpsertCoursesRequest } from 'manabie-yasuo/course_pb';
import { createRandomCourses } from 'test-suites/common/step-definitions/course-definitions';
import {
    addCoursesForStudent,
    goToEditStudentDetailPage,
} from 'test-suites/squads/user-management/step-definitions/user-update-student-definitions';

const enum SearchConversationType {
    empty = 'empty',
    fullName = 'full name',
    partialName = 'partial name',
}

const enum StudentName {
    empty = 'empty',
    studentS1Name = "student S1's name",
    studentS2Name = "student S2's name",
}

Given(
    'school admin has created {string} with grade and {string} info',
    async function (
        this: IMasterWorld,
        studentRole: AccountRoles,
        parentRole: AccountRoles
    ): Promise<void> {
        const cms = this.cms;
        const context = this.scenario;
        await cms.instruction(
            `Create ${studentRole} with ${parentRole} info`,
            async function (cms) {
                await createStudentWithParent(cms, context, studentRole);
            }
        );
    }
);

Given(
    'school admin has created 2 courses Course C1 and Course C2',
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;

        await this.cms.instruction(
            `Create 2 courses Course C1 and Course C2`,
            async function (cms) {
                // Setup course info
                const responseCourse = await createRandomCourses(cms, { quantity: 2 });
                const { id: courseC1, name: courseNameC1 } = responseCourse.request[0];
                const { id: courseC2, name: courseNameC2 } = responseCourse.request[1];
                context.set(aliasChatGroupCourseIdC1, courseC1);
                context.set(aliasChatGroupCourseNameC1, courseNameC1);
                context.set(aliasChatGroupCourseIdC2, courseC2);
                context.set(aliasChatGroupCourseNameC2, courseNameC2);
            }
        );
    }
);

Given(
    'school admin has added {string} for {string}',
    async function (
        this: IMasterWorld,
        course: CourseRoles,
        studentRole: AccountRoles
    ): Promise<void> {
        const context = this.scenario;

        const courseId = context.get<string>(
            course === 'Course C1' ? aliasChatGroupCourseIdC1 : aliasChatGroupCourseIdC2
        );

        const courseIdList = [courseId];

        await this.cms.instruction(
            `Add a course ${course} for ${studentRole} by calling gRPC`,
            async function (cms) {
                const profile = context.get<UserProfileEntity>(
                    learnerProfileAliasWithAccountRoleSuffix(studentRole)
                );

                const randomLocation = getRandomElement(profile.locations || []);

                await addCoursesForStudent(cms, {
                    courseIds: courseIdList,
                    studentId: profile.id,
                    locationId: randomLocation.locationId,
                });
            }
        );
    }
);

Given(
    'teacher has sent message to {string}',
    async function (this: IMasterWorld, role: AccountRoles) {
        const scenario = this.scenario;
        let learnerRole = role;
        if (role == 'parent P1') learnerRole = 'student S1';
        if (role == 'parent P2') learnerRole = 'student S2';
        const studentId = getUserIdFromContextWithAccountRole(scenario, learnerRole);
        const teacher = this.teacher;
        const isParent = isParentRole(role);
        const messageTextType = MessageType.text;
        scenario.set(aliasMessageType, messageTextType);

        await teacher.instruction('Teacher select joined tab', async function (teacher) {
            await teacherSelectedJoinedTab(teacher);
        });

        await teacher.instruction(`Teacher accesses ${role} chat group`, async function (teacher) {
            await teacherSelectConversation(teacher, isParent, studentId);
        });

        await teacher.instruction(
            `Teacher send message with ${messageTextType}`,
            async function (teacher) {
                await teacherSendMessageWithType(teacher, scenario, messageTextType);
            }
        );

        const messageText = this.scenario.get<string>(messageContentKey);
        await teacher.instruction(`${messageTextType} is sent`, async function (teacher) {
            await teacherSeesMessageIsSent(teacher, messageTextType, messageText);
        });
    }
);

Given(
    'teacher has filled {string} of {string} in search bar on Teacher App',
    async function (
        this: IMasterWorld,
        searchType: SearchConversationType,
        studentName: StudentName
    ) {
        const teacher = this.teacher;
        const learnerRole = studentName == StudentName.studentS1Name ? 'student S1' : 'student S2';

        let searchText = '';
        switch (searchType) {
            case SearchConversationType.empty:
                {
                    searchText = '';
                }
                break;
            case SearchConversationType.fullName:
                {
                    const learnerProfile = getUserProfileFromContext(
                        this.scenario,
                        learnerProfileAliasWithAccountRoleSuffix(learnerRole)
                    );
                    searchText = learnerProfile.name;
                }
                break;
        }

        this.scenario.set(aliasSearchConversationType, searchType);
        this.scenario.set(aliasStudentName, studentName);

        await teacher.instruction(
            `teacher enter ${searchType} of ${studentName} into search bar`,
            async function () {
                await teacherEnterSearchTextInConversationBar(teacher, searchText);
            }
        );
    }
);

Given(
    '{string} has started filter conversation on Teacher App',
    async function (this: IMasterWorld, teacherRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);

        await teacher.instruction(`${teacherRole} tap filter icon button`, async function () {
            await teacherTapFilterIconButton(teacher);
        });
    }
);

Given(
    'teacher has selected message type {string}',
    async function (this: IMasterWorld, messageTypeFilter: MessageTypeFilter) {
        const teacher = this.teacher;
        const scenarioContext = this.scenario;
        scenarioContext.set(aliasMessageTypeFilter, messageTypeFilter);

        await teacher.instruction(
            `teacher has selected message type is ${messageTypeFilter}`,
            async function () {
                await teacherFilterMessageType(teacher, messageTypeFilter);
            }
        );
    }
);

Given(
    'teacher has selected contact filter {string}',
    async function (this: IMasterWorld, contactFilter: ContactFilter) {
        const teacher = this.teacher;
        const scenarioContext = this.scenario;
        scenarioContext.set(aliasContactFilter, contactFilter);

        await teacher.instruction(
            `teacher has selected contact filter is ${contactFilter}`,
            async function () {
                await teacherFilterContact(teacher, contactFilter);
            }
        );
    }
);

Given(
    '{string} has selected {string} filter',
    async function (this: IMasterWorld, teacherRole: AccountRoles, courseFiltersString: string) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const scenario = this.scenario;

        // No action for filter is all courses
        if (courseFiltersString === 'all courses') {
            scenario.set(aliasCourseFilter, courseFiltersString);
            return;
        }

        const courseFilter = getRandomCourseFilter(courseFiltersString);
        scenario.set(aliasCourseFilter, courseFilter);

        const courseC1 = scenario.get<UpsertCoursesRequest.Course.AsObject[]>(
            courseListAliasWithAccountRoleSuffix('student S1')
        )[0];
        const courseC2 = scenario.get<UpsertCoursesRequest.Course.AsObject[]>(
            courseListAliasWithAccountRoleSuffix('student S2')
        )[0];

        const courseIds: string[] = [];
        switch (courseFilter) {
            case 'Course C1':
                courseIds.push(courseC1.id);
                break;
            case 'Course C2':
                courseIds.push(courseC2.id);
                break;
            case 'Course C1 & Course C2':
                courseIds.push(courseC1.id);
                courseIds.push(courseC2.id);
                break;
        }

        await teacher.instruction(
            `${teacherRole} select ${courseFiltersString} in course filter popup`,
            async () => {
                await teacherFilterConversationByCourseIds(teacher, courseIds);
            }
        );
    }
);

When('teacher applies above filters', async function () {
    const teacher = this.teacher;

    await teacher.instruction('teacher tap apply filter button', async function () {
        await teacherTapApplyFilterButton(teacher);
    });
});

Then('teacher sees all chat groups matches with the above filters', async function () {
    const teacher = this.teacher;
    const scenarioContext = this.scenario;
    const studentS1 = 'student S1';
    const studentS2 = 'student S2';
    const parentP1 = 'parent P1';
    const parentP2 = 'parent P2';
    const studentS1Id = getUserIdFromContextWithAccountRole(scenarioContext, studentS1);
    const studentS2Id = getUserIdFromContextWithAccountRole(scenarioContext, studentS2);
    const studentName = scenarioContext.get<StudentName>(aliasStudentName);
    const searchType = scenarioContext.get<SearchConversationType>(aliasSearchConversationType);
    const messageTypeFilter = scenarioContext.get<MessageTypeFilter>(aliasMessageTypeFilter);
    const contactFilter = scenarioContext.get<ContactFilter>(aliasContactFilter);
    const coursesFilter = scenarioContext.get<CourseFilter>(aliasCourseFilter);

    await teacher.instruction('Teacher selected joined tab', async function () {
        await teacherSelectedJoinedTab(teacher);
    });

    if (searchType != SearchConversationType.empty) {
        switch (studentName) {
            case StudentName.studentS1Name:
                {
                    await teacherSeeGroupChatInstruction(teacher, studentS1Id, studentS1);
                    await teacherSeeGroupChatInstruction(teacher, studentS1Id, parentP1);
                }
                break;
            case StudentName.studentS2Name:
                {
                    await teacherSeeGroupChatInstruction(teacher, studentS2Id, studentS2);
                    await teacherSeeGroupChatInstruction(teacher, studentS2Id, parentP2);
                }
                break;
        }
        return;
    }

    if (
        contactFilter == ContactFilter.all &&
        messageTypeFilter == MessageTypeFilter.all &&
        (coursesFilter == 'all courses' || coursesFilter == 'Course C1 & Course C2')
    ) {
        await teacherSeeGroupChatInstruction(teacher, studentS1Id, studentS1);
        await teacherSeeGroupChatInstruction(teacher, studentS1Id, parentP1);
        await teacherSeeGroupChatInstruction(teacher, studentS2Id, studentS2);
        await teacherSeeGroupChatInstruction(teacher, studentS2Id, parentP2);

        await teacherSeeRepliedIconAtGroupChatInstruction(teacher, studentS1Id, studentS1);
        await teacherNotSeeRepliedIconAtGroupChatInstruction(teacher, studentS1Id, parentP1);
        await teacherNotSeeRepliedIconAtGroupChatInstruction(teacher, studentS2Id, studentS2);
        await teacherSeeRepliedIconAtGroupChatInstruction(teacher, studentS2Id, parentP2);
    }

    if (contactFilter == ContactFilter.all && coursesFilter == 'all courses') {
        if (messageTypeFilter == MessageTypeFilter.notReply) {
            await teacherNotSeeGroupChatInstruction(teacher, studentS1Id, studentS1);
            await teacherSeeGroupChatInstruction(teacher, studentS1Id, parentP1);
            await teacherSeeGroupChatInstruction(teacher, studentS2Id, studentS2);
            await teacherNotSeeGroupChatInstruction(teacher, studentS2Id, parentP2);

            await teacherNotSeeRepliedIconAtGroupChatInstruction(teacher, studentS1Id, parentP1);
            await teacherNotSeeRepliedIconAtGroupChatInstruction(teacher, studentS2Id, studentS2);
        }
    }

    if (messageTypeFilter == MessageTypeFilter.all && coursesFilter == 'all courses') {
        if (contactFilter == ContactFilter.student) {
            await teacherSeeGroupChatInstruction(teacher, studentS1Id, studentS1);
            await teacherNotSeeGroupChatInstruction(teacher, studentS1Id, parentP1);
            await teacherSeeGroupChatInstruction(teacher, studentS2Id, studentS2);
            await teacherNotSeeGroupChatInstruction(teacher, studentS2Id, parentP2);
        }

        if (contactFilter == ContactFilter.parent) {
            await teacherNotSeeGroupChatInstruction(teacher, studentS1Id, studentS1);
            await teacherSeeGroupChatInstruction(teacher, studentS1Id, parentP1);
            await teacherNotSeeGroupChatInstruction(teacher, studentS2Id, studentS2);
            await teacherSeeGroupChatInstruction(teacher, studentS2Id, parentP2);
        }
    }

    if (messageTypeFilter == MessageTypeFilter.all && contactFilter == ContactFilter.all) {
        switch (coursesFilter) {
            case 'Course C1':
                {
                    await teacherSeeGroupChatInstruction(teacher, studentS1Id, studentS1);
                    await teacherSeeGroupChatInstruction(teacher, studentS1Id, parentP1);
                    await teacherNotSeeGroupChatInstruction(teacher, studentS2Id, studentS2);
                    await teacherNotSeeGroupChatInstruction(teacher, studentS2Id, parentP2);
                }
                break;
            case 'Course C2':
                {
                    await teacherNotSeeGroupChatInstruction(teacher, studentS1Id, studentS1);
                    await teacherNotSeeGroupChatInstruction(teacher, studentS1Id, parentP1);
                    await teacherSeeGroupChatInstruction(teacher, studentS2Id, studentS2);
                    await teacherSeeGroupChatInstruction(teacher, studentS2Id, parentP2);
                }
                break;
        }
    }
});

async function teacherSeeGroupChatInstruction(
    teacher: TeacherInterface,
    studentId: string,
    role: AccountRoles
) {
    const isParent = isParentRole(role);
    await teacher.instruction(`teacher sees ${role} group chat in joined tab`, async function () {
        isParent
            ? await teacherSeeParentGroupChat(teacher, studentId)
            : await teacherSeeStudentGroupChat(teacher, studentId);
    });
}

async function teacherNotSeeGroupChatInstruction(
    teacher: TeacherInterface,
    studentId: string,
    role: AccountRoles
) {
    const isParent = isParentRole(role);
    await teacher.instruction(
        `teacher not sees ${role} group chat in joined tab`,
        async function () {
            isParent
                ? await teacherNotSeeParentGroupChat(teacher, studentId)
                : await teacherNotSeeStudentGroupChat(teacher, studentId);
        }
    );
}

async function teacherSeeRepliedIconAtGroupChatInstruction(
    teacher: TeacherInterface,
    studentId: string,
    role: AccountRoles
) {
    const isParent = isParentRole(role);
    await teacher.instruction(
        `teacher sees ${role} group chat have replied icon in joined tab`,
        async function () {
            await teacherSeesReplyStatus(teacher, studentId, isParent);
        }
    );
}

async function teacherNotSeeRepliedIconAtGroupChatInstruction(
    teacher: TeacherInterface,
    studentId: string,
    role: AccountRoles
) {
    const isParent = isParentRole(role);
    await teacher.instruction(
        `teacher not sees ${role} group chat have replied icon in joined tab`,
        async function () {
            await teacherNotSeesReplyStatus(teacher, studentId, isParent);
        }
    );
}

When(
    'school admin updates {string} with random name',
    async function (this: IMasterWorld, learnerRole: AccountRoles) {
        const cms = this.cms;
        const { context } = this.scenario;
        const accountProfile = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(learnerRole)
        );
        const parentProfiles =
            context.get(parentProfilesAliasWithAccountRoleSuffix(learnerRole)) ?? [];
        const courses =
            context.get(studentCoursePackageListAliasWithAccountRoleSuffix(learnerRole)) ?? [];

        await cms.instruction(`School admin go to edit the student page`, async () => {
            await goToEditStudentDetailPage(this, accountProfile, parentProfiles, courses);
        });

        await cms.instruction(`School admin update ${learnerRole} with random name`, async () => {
            await cmsUpdateStudentWithRandomName(cms, this.scenario);
        });
    }
);

When(
    '{string} searches for partial name of {string} in search bar on Teacher App',
    async function (this: IMasterWorld, teacherRole: AccountRoles, learnerRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const { context } = this.scenario;
        const partialName = context.get(aliasPartialName) as string;

        await teacher.instruction(
            `teacher search partial name of ${learnerRole} in search bar`,
            async () => {
                await teacherEnterSearchTextInConversationBar(teacher, partialName);
            }
        );

        await teacher.instruction(`${teacherRole} apply the filter`, async function () {
            await teacherTapFilterIconButton(teacher);
            await teacherTapApplyFilterButton(teacher);
        });
    }
);

Then(
    '{string} sees both student & parent of {string} chat group on Teacher App',
    async function (this: IMasterWorld, teacherRole: AccountRoles, learnerRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const studentId = getStudentIdFromContextWithAccountRole(this.scenario, learnerRole);

        await teacher.instruction(
            `${teacherRole} sees both student & parent chat group of ${learnerRole}`,
            async () => {
                await teacherSeeStudentGroupChat(teacher, studentId);
                await teacherSeeParentGroupChat(teacher, studentId);
            }
        );
    }
);

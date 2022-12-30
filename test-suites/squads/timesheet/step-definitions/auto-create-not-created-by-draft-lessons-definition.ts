import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import { lookingForIcon } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Response } from 'playwright';

import { CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import createGrpcMessageDecoder from '@supports/packages/grpc-message-decoder';
import { ScenarioContext } from '@supports/scenario-context';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import { searchTimesheetByStaffName } from './apply-status-filter-name-search-and-date-filter-definitions';
import {
    changeTimeLesson,
    goToLessonManagement,
    openCreateLessonDialog,
    searchTeacher,
} from './auto-remove-lesson-hours-in-timesheet-definitions';
import { CreateLessonResponse } from 'manabuf/bob/v1/lessons_pb';
import { lessonDateV3 } from 'test-suites/squads/lesson/common/cms-selectors';
import { waitCreateLesson } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { selectCenterByNameV3, selectTeacher } from 'test-suites/squads/lesson/utils/lesson-upsert';
import { lessonManagementLessonSaveAsDraftButton } from 'test-suites/squads/timesheet/common/cms-selectors/lesson-upsert';
import { assertElementExists } from 'test-suites/squads/timesheet/common/step-definitions/common-assertion-definitions';
import { selectDateAndMonthInPicker } from 'test-suites/squads/timesheet/common/step-definitions/timesheet-common-definitions';

type LessonData = {
    date: Date;
    startTime: string;
    endTime: string;
};

type CreateDraftLessonProps = {
    cms: CMSInterface;
    context: ScenarioContext;
    lessonData: LessonData;
    lessonKey?: string;
};

export const getLessonContextKey = (lessonKey: string) => `lesson-${lessonKey}`;

export const createDraftLesson = async ({
    cms,
    context,
    lessonData: { startTime, endTime, date },
    lessonKey,
}: CreateDraftLessonProps) => {
    const firstGrantedLocation = context.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
    const staff = context.get<UserProfileEntity>(staffProfileAliasWithAccountRoleSuffix('teacher'));
    const teacherName = staff.name;

    await cms.instruction('Create draft lesson', async () => {
        await goToLessonManagement(cms);
        await openCreateLessonDialog(cms);
        await changeTimeLesson(cms, startTime, endTime);
        await selectCenterByNameV3(cms, firstGrantedLocation.name);
        await searchTeacher(cms, teacherName);
        await selectTeacher(cms, teacherName);
        await changeLessonDate(cms, date);

        await cms.instruction(`School admin saves lesson as draft`, async function () {
            const [createLessonResponse] = await Promise.all([
                waitCreateLesson(cms),
                triggerSaveDraftLesson(cms),
            ]);

            if (lessonKey) {
                const lessonId = await parseCreateLessonResponse(createLessonResponse);
                context.set(getLessonContextKey(lessonKey), lessonId);
            }
        });
    });
};

export const changeLessonDate = async (cms: CMSInterface, desiredDate: Date) => {
    await cms.instruction(
        `change lesson date to ${desiredDate.toLocaleString()}`,
        async function () {
            await selectDateAndMonthInPicker(cms, desiredDate, lessonDateV3);
        }
    );
};

export const triggerSaveDraftLesson = async (cms: CMSInterface) => {
    await cms.page!.click(lessonManagementLessonSaveAsDraftButton);
};

export const parseCreateLessonResponse = async (response: Response) => {
    const decoder = createGrpcMessageDecoder(CreateLessonResponse);
    const encodedResponseText = await response.text();
    const decodedResponse = decoder.decodeMessage(encodedResponseText);

    const { id: lessonId } = decodedResponse?.toObject() || { id: '' };
    return lessonId;
};

export const assertTimesheetManagementTableEmpty = async (cms: CMSInterface) => {
    await cms.instruction('Navigate to timesheet management page', async function () {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.TIMESHEET_MANAGEMENT);
        await cms.waitingForProgressBar();
    });

    await cms.instruction('Assert table is empty', async () => {
        await assertElementExists(cms, lookingForIcon);
    });
};

export const assertNoTimesheetsCreatedFor = async (
    cms: CMSInterface,
    context: ScenarioContext,
    user: string
) => {
    await cms.instruction('Navigate to timesheet management page', async function () {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.TIMESHEET_MANAGEMENT);
    });

    await cms.instruction(`Search ${user} on search input`, async () => {
        await searchTimesheetByStaffName(cms, context, user);
        await cms.waitForSkeletonLoading();
    });

    await cms.instruction('Assert table is empty', async () => {
        await assertElementExists(cms, lookingForIcon);
    });
};

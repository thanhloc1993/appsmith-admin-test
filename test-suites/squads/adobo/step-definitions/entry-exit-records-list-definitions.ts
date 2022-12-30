import { CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { entryExitMgmtService } from '@supports/services/entry-exit';
import { EntryExitRecordData } from '@supports/services/entry-exit/service';
import { StudentDetailTab } from '@supports/types/cms-types';

import { StatusTypes } from './entry-exit-add-entry-exit-record-definitions';
import { editStudentEnrollmentStatusOnCMS } from './entry-exit-cannot-edit-entry-exit-record-definitions';
import { FilterTypes } from './entry-exit-filter-records-in-learner-app-steps';
import {
    dateFilterChildItem,
    studentEntryExitRecordDateFilterDropdown,
} from 'test-suites/squads/adobo/common/cms-selectors/entry-exit';
import { schoolAdminChooseTabInStudentDetail } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';
import { findNewlyCreatedLearnerOnCMSStudentsPage } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';
import { clickOnStudentOnStudentsTab } from 'test-suites/squads/user-management/step-definitions/user-view-student-details-definitions';

export async function createExistingRecordForStudent(
    cms: CMSInterface,
    student: UserProfileEntity,
    newEntry: Date,
    hasExited: boolean
) {
    const token = await cms.getToken();
    const entry = new Date(newEntry);
    if (hasExited) entry.setHours(entry.getHours() - 1);
    const newExit = new Date(newEntry);

    const entryExitReq: EntryExitRecordData = {
        studentId: student.id,
        entryDateTime: entry,
        exitDateTime: hasExited ? newExit : undefined,
        notifyParents: true,
    };

    await entryExitMgmtService.createEntryExitRecord(token, entryExitReq);
}

export async function updateStatusAndGoToStudentEntryExitTab(
    cms: CMSInterface,
    learnerProfile: UserProfileEntity,
    status: StatusTypes
) {
    await cms.instruction(`Go to student management page`, async function () {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
    });

    await cms.waitForSkeletonLoading();

    await cms.instruction(`Find student ${learnerProfile.name} on student list`, async function () {
        await findNewlyCreatedLearnerOnCMSStudentsPage(cms, learnerProfile);
    });

    await cms.instruction(
        `Click student ${learnerProfile.name} on student list`,
        async function () {
            await clickOnStudentOnStudentsTab(cms, learnerProfile);
            await cms.waitForSkeletonLoading();
        }
    );

    await cms.instruction(`Update student status to ${status}`, async function () {
        await editStudentEnrollmentStatusOnCMS(cms, status);
        await cms.waitingForLoadingIcon();
    });

    await cms.instruction(
        `School admin goes to Entry & Exit tab in Student Detail page of ${learnerProfile.name}`,
        async function () {
            await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.ENTRY_EXIT);
        }
    );
}

export async function tapOnStudentEntryExitRecordDateFilter(cms: CMSInterface) {
    const page = cms.page!;

    await cms.instruction('Tap on student entry exit record date filter', async function () {
        await page.click(studentEntryExitRecordDateFilterDropdown);
    });
}

export async function tapOnChildItemOnStudentEntryExitRecordsDateFilter(
    cms: CMSInterface,
    filter: FilterTypes
) {
    const page = cms.page!;
    let filterKey = 'default';

    switch (filter) {
        case 'last month':
            filterKey = 'lastMonth';
            break;
        case 'this month':
            filterKey = 'thisMonth';
            break;
        case 'this year':
            filterKey = 'thisYear';
            break;
        default:
            break;
    }

    await cms.instruction(`Filter student entry/exit records by ${filter}`, async function () {
        const dateFilterChildItemFinder = dateFilterChildItem(filterKey);
        await page.click(dateFilterChildItemFinder);
    });
}

export async function filterEntryExitRecordsByDateInBackOffice(
    cms: CMSInterface,
    filter: FilterTypes
) {
    await tapOnStudentEntryExitRecordDateFilter(cms);
    await tapOnChildItemOnStudentEntryExitRecordsDateFilter(cms, filter);
}

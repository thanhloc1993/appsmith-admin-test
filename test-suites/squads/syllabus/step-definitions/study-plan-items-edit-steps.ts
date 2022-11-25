import {
    convertOneOfStringTypeToArray,
    getRandomElements,
    randomInteger,
} from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { CMSInterface, LOType } from '@supports/app-types';
import { getDateAfterDuration, getDateBeforeDuration } from '@supports/utils/time/time';

import {
    aliasBulkChangeDateTime,
    aliasBulkEditAction,
    aliasBulkEditPostponeAdvanceDate,
    aliasCourseId,
    aliasCourseName,
    aliasEnteredStudyPlanItemFields,
    aliasRandomStudyPlanItems,
    aliasStudyPlanId,
    aliasStudyPlanItemDateTypeValue,
    aliasStudyPlanItemValue,
    aliasStudyPlanItemValues,
    aliasStudyPlanItemYear,
    aliasStudyPlanName,
    aliasStudyPlanRowsWithTopicNameIds,
    aliasStudyPlanSelectedItemIds,
} from './alias-keys/syllabus';
import {
    BulkEditStudyPlanItemOption,
    BulkEditStudyPlanItemTab,
    getStudyPlanItemDateTimeFieldName,
    schoolAdminActsOnDisplayHiddenItems,
    schoolAdminBulkEditAcceptChange,
    schoolAdminClicksOnBulkEditMenuButton,
    schoolAdminCountStudyPlanItemsSelected,
    schoolAdminEditsStudyPlanItems,
    schoolAdminEntersFieldLaterThanOtherField,
    schoolAdminEntersRandomStudyPlanItemFields,
    schoolAdminEntersStarDueOutOfRange,
    schoolAdminEntersStudyPlanItemValueByType,
    schoolAdminGoToStudyPlanDetail,
    schoolAdminGoToStudyPlanDetailViaUrl,
    schoolAdminModifiesStudyPlanItemsForAvailable,
    schoolAdminPostponeAdvanceUpdate,
    schoolAdminSavesStudyPlanItems,
    schoolAdminSeesAllEditActionsDisabled,
    schoolAdminSeesBulkDateTimeChanged,
    schoolAdminSeesCourseStudyPlanItemEmptyTimes,
    schoolAdminSeesDueDateSevensDayLater,
    schoolAdminSeesErrorFieldAndOtherField,
    schoolAdminSeesErrorMessageEachField,
    schoolAdminSeesIndividualStudyPlanItemsChanged,
    schoolAdminSeesStartDueOutOfAvailableDate,
    schoolAdminSeesStudyItemDatesEmpty,
    schoolAdminSeesStudyPlanBulkItemValuesChanged,
    schoolAdminSeesStudyPlanBulkItemValuesUnChanged,
    schoolAdminSeesStudyPlanItemsPostponeAdvance,
    schoolAdminSeesStudyPlanItemsSelected,
    schoolAdminSeesStudyPlanItemValuesChanged,
    schoolAdminSeesStudyPlanItemValuesUnchanged,
    schoolAdminSeesStudyPlanTopicsSelected,
    schoolAdminSelectBulkEditAction,
    schoolAdminSelectsStudyPlanItems,
    schoolAdminSelectsStudyPlanTopics,
    schoolAdminSelectTimePicker,
    setAvailableDateAndTimeToStudy,
    setPostponeAdvanceDateTimeValue,
    StudyPlanDurationDate,
    StudyPlanDurationTime,
    StudyPlanItemDateField,
    StudyPlanItemDisplayAction,
    StudyPlanItemStatus,
    StudyPlanType,
    TopicSelectionSet,
    ValueType,
} from './study-plan-items-edit-definitions';
import { getNameByLoType } from './syllabus-learning-objectives-create-definitions';
import {
    schoolAdminGoesToIndividualStudyPlan,
    schoolAdminWaitingStudyPlanDetailLoading,
    StudyPlanPageType,
} from './syllabus-study-plan-common-definitions';
import {
    getDatePickerParams,
    getFirstStudyPlanItemValues,
    goToStudyPlanDetailsFromBreadcrumb,
    schoolAdminBulkActionStudyPlanItems,
} from './syllabus-study-plan-item-common-definitions';
import {
    StudyPlanItem,
    StudyPlanItemTimeField,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

Given(
    'school admin is at the {string} study plan details page',
    async function (studyPlanPageType: StudyPlanPageType) {
        try {
            const courseName = this.scenario.get(aliasCourseName);
            const studyPlanName = this.scenario.get(aliasStudyPlanName);

            await this.cms.instruction(
                'school admin goes to course study plan detail page',
                async () => {
                    await schoolAdminGoToStudyPlanDetail(
                        this.cms,
                        studyPlanPageType,
                        courseName,
                        studyPlanName
                    );
                }
            );
        } catch {
            const studyPlanId = this.scenario.get(aliasStudyPlanId);
            const courseId = this.scenario.get(aliasCourseId);

            await this.cms.instruction(
                `school admin navigates to study plan detail page via url`,
                async () => {
                    await schoolAdminGoToStudyPlanDetailViaUrl(this.cms, studyPlanId, courseId);
                }
            );
        }
    }
);

Given(
    `school admin is at the individual study plan details page of {string}`,
    async function (student: 'student S1' | 'student S2') {
        await this.cms.instruction(
            `School admin go to individual study plan page of ${student}`,
            async () => {
                await schoolAdminGoesToIndividualStudyPlan(this.cms, this.scenario, student);
            }
        );
    }
);

When('school admin {string} Display hidden items', function (action: StudyPlanItemDisplayAction) {
    return this.cms.instruction(`${action} the Display hidden items option`, (cms) =>
        schoolAdminActsOnDisplayHiddenItems(cms, action)
    );
});

When('school admin edits the study plan content', async function () {
    const originalValues = await getFirstStudyPlanItemValues(this.cms);

    this.scenario.set(aliasStudyPlanItemValues, originalValues);

    await this.cms.instruction(
        'school admin click the edit button',
        schoolAdminEditsStudyPlanItems
    );
});

Then('school admin sees all edit actions are disabled', async function () {
    await this.cms.instruction(
        'school admin check all edit actions are disabled',
        schoolAdminSeesAllEditActionsDisabled
    );
});

When('school admin clicks the bulk action menu button without selecting items', async function () {
    return this.cms.instruction(
        'school admin clicks on bulk menu button',
        schoolAdminClicksOnBulkEditMenuButton
    );
});

When(
    'school admin selects {string} topics in {string} study plan',
    async function (topicSet: TopicSelectionSet, studyPlanType: StudyPlanType) {
        return this.cms.instruction(
            `select ${topicSet} topics in ${studyPlanType} study plan`,
            (cms) => schoolAdminSelectsStudyPlanTopics(cms, this.scenario, topicSet)
        );
    }
);

When(
    'school admin selects {int} study plan items in {int} topics in {string} study plan to update',
    async function (numberOfItems: number, numberOfTopics: number, studyPlanType: StudyPlanType) {
        return this.cms.instruction(
            `select ${numberOfItems} study plan items in ${numberOfTopics} topics in ${studyPlanType} study plan`,
            (cms) =>
                schoolAdminSelectsStudyPlanItems(cms, this.scenario, numberOfItems, numberOfTopics)
        );
    }
);

When('school admin selects {string} in bulk edit menu', async function (actions: string) {
    const randomIndex = randomInteger(0, 1);

    const action = convertOneOfStringTypeToArray(actions)[
        randomIndex
    ] as BulkEditStudyPlanItemOption;

    this.scenario.set(aliasBulkEditAction, action);

    return this.cms.instruction(`select bulk edit ${action}`, (cms) =>
        schoolAdminSelectBulkEditAction(cms, action)
    );
});

Then(
    'school admin sees the {string} study plan items with empty dates',
    function (status: StudyPlanItemStatus) {
        return this.cms.instruction(`show ${status} study plan items`, (cms) =>
            schoolAdminSeesStudyItemDatesEmpty(cms, status)
        );
    }
);

When(
    'school admin enters Start and Due dates that are out of Available From and Available Until range',
    function () {
        return this.cms.instruction(
            'enter Start and Due dates out of Available From and Available Until range',
            schoolAdminEntersStarDueOutOfRange
        );
    }
);

When(
    'school admin sees {string} topics in {string} study plan are selected',
    async function (topicSet: TopicSelectionSet, studyPlanType: StudyPlanType) {
        const rowsWithTopicNameIds: string[] = await this.scenario.get(
            aliasStudyPlanRowsWithTopicNameIds
        );

        return this.cms.instruction(
            `School admin sees study plan ${topicSet} topics in ${studyPlanType} study plan are selected`,
            (cms) => schoolAdminSeesStudyPlanTopicsSelected(cms, rowsWithTopicNameIds, topicSet)
        );
    }
);

Then(
    'school admin sees all active and archived study plan items in {string} topics in {string} study plan are selected',
    async function (topicSet: TopicSelectionSet, studyPlanType: StudyPlanType) {
        const selectedItemIds: string[] = this.scenario.get(aliasStudyPlanSelectedItemIds);

        return this.cms.instruction(
            `School admin sees all active and archived study plan items in ${topicSet} topics in ${studyPlanType} study plan are selected`,
            () => schoolAdminSeesStudyPlanItemsSelected(this.cms, selectedItemIds)
        );
    }
);

Then(
    `school admin sees only {int} study plan items in {string} study plan are selected`,
    async function name(numberOfItems: number, studyPlanType: StudyPlanType) {
        const selectedItemIds: string[] = this.scenario.get(aliasStudyPlanSelectedItemIds);

        return this.cms.instruction(
            `School admin counts ${numberOfItems} selected items in ${studyPlanType}`,
            (cms) => schoolAdminCountStudyPlanItemsSelected(cms, numberOfItems, selectedItemIds)
        );
    }
);

When(
    'school admin updates study plan items with {string} and {string} which are available for studying',
    async function (date: StudyPlanDurationDate, time?: StudyPlanDurationTime) {
        const { selectedDate, selectedTime } = setAvailableDateAndTimeToStudy(
            this.scenario,
            date,
            time
        );

        const _cms: CMSInterface = this.cms;

        await _cms.instruction(
            `school admin selects Bulk Edit date ${selectedDate} and time ${selectedTime}`,
            async function () {
                if (selectedDate) {
                    const datePickerParams = getDatePickerParams(selectedDate);
                    await _cms.selectDatePickerMonthAndDay(datePickerParams);
                }

                selectedTime && (await schoolAdminSelectTimePicker(_cms, selectedTime));
            }
        );

        return _cms.instruction(`bulk changing study plan items date and time`, (cms) =>
            schoolAdminBulkEditAcceptChange(cms)
        );
    }
);

When(
    'school admin updates study plan items with {string} action',
    async function (tab: BulkEditStudyPlanItemTab) {
        const _cms = this.cms;
        const context = this.scenario;
        // select latest bulk action
        const bulkAction = context.get<BulkEditStudyPlanItemOption>(aliasBulkEditAction);

        await _cms.instruction(`school admin selects bulk edit ${bulkAction}`, () =>
            schoolAdminSelectBulkEditAction(_cms, bulkAction)
        );

        const duration = randomInteger(1, 7);
        const currentDateValue = context.get<Date>(aliasStudyPlanItemDateTypeValue);
        const currentDateTimeValue = context.get<string>(aliasStudyPlanItemValue);
        const currentTime = currentDateTimeValue.split(',')[1];

        let tabIndex = 0;

        switch (tab) {
            case 'postpone': {
                const postponeDate = getDateAfterDuration(duration, 'days', currentDateValue);
                setPostponeAdvanceDateTimeValue(context, postponeDate, currentTime);

                tabIndex = 1;
                break;
            }

            case 'advance': {
                const advanceDate = getDateBeforeDuration(duration, 'days', currentDateValue);
                setPostponeAdvanceDateTimeValue(context, advanceDate, currentTime);

                tabIndex = 2;
                break;
            }
        }

        await _cms.instruction(`school admin bulk edits with ${tab} date`, (cms) =>
            schoolAdminPostponeAdvanceUpdate(cms, { tabIndex, tab, duration })
        );

        await _cms.instruction(`school admin submits change to ${tab} date`, (cms) =>
            schoolAdminBulkEditAcceptChange(cms)
        );
    }
);

Then(
    'school admin updates study plan items with {string} and {string}',
    async function (topicSet: TopicSelectionSet, studyPlanType: StudyPlanType) {
        const action: BulkEditStudyPlanItemOption = this.scenario.get(aliasBulkEditAction);

        const field: StudyPlanItemTimeField = getStudyPlanItemDateTimeFieldName(action);

        const changedValue = this.scenario.get<string>(aliasBulkChangeDateTime);

        const studyPlanItems: StudyPlanItem[] = this.scenario.get(aliasRandomStudyPlanItems);

        const fieldNames = studyPlanItems.map((item: any) => {
            return `studyPlanItem.${item.info.id}.${field}`;
        });

        return this.cms.instruction(
            `school admin sees ${topicSet} study plan items in ${studyPlanType} study plan`,
            (cms) => schoolAdminSeesBulkDateTimeChanged(cms, fieldNames, changedValue)
        );
    }
);

Then(
    'school admin sees study plan items in {string} study plan are changed with {string} days',
    function (studyPlanType: StudyPlanType, tab: BulkEditStudyPlanItemTab) {
        const currentDateValue: string = this.scenario.get(aliasStudyPlanItemValue);
        const action: BulkEditStudyPlanItemOption = this.scenario.get(aliasBulkEditAction);
        const itemIds: string[] = this.scenario.get(aliasStudyPlanSelectedItemIds);
        const changedDate: Date = this.scenario.get(aliasBulkEditPostponeAdvanceDate);

        return this.cms.instruction(
            `school admin sees study plan items in ${studyPlanType} study plan change with ${tab} days`,
            (cms) =>
                schoolAdminSeesStudyPlanItemsPostponeAdvance(cms, {
                    itemIds,
                    currentDateValue,
                    changedDate,
                    action,
                })
        );
    }
);

When('school admin saves the editing study plan content process', function () {
    return this.cms.instruction('press the save button and confirm the dialog', (cms) =>
        schoolAdminSavesStudyPlanItems(cms, this.scenario)
    );
});

Then(
    `school admin sees the values of the study plan items in {string} study plan changed correctly`,
    function (studyPlanType: StudyPlanType) {
        return this.cms.instruction(
            `School admin sees bulk study plan items values changed in ${studyPlanType} study plan`,
            async (cms) => {
                await schoolAdminWaitingStudyPlanDetailLoading(cms);
                await schoolAdminSeesStudyPlanBulkItemValuesChanged(cms, this.scenario);
            }
        );
    }
);

// Edit at master and go to individual page to check
Then(
    `school admin sees the values of {string} study plan items in individual study plan of {string} changed correctly`,
    async function (setItems: 'all' | 'many', student: 'student S1' | 'student S2') {
        await this.cms.instruction(
            `School admin go to individual study plan page of ${student}`,
            async () => {
                await schoolAdminGoesToIndividualStudyPlan(this.cms, this.scenario, student);
            }
        );

        return await this.cms.instruction(
            `School admin sees ${setItems} study plan items values changed in individual study plan of ${student}`,
            async (cms) => {
                await schoolAdminSeesStudyPlanBulkItemValuesChanged(cms, this.scenario);
            }
        );
    }
);

// Edit at individual page of a student and go to individual study plan of other student
Then(
    `school admin sees values of these study plan items in individual study plan of {string} unchanged`,
    async function (student: 'student S1' | 'student S2') {
        await this.cms.instruction(
            `School admin go to individual study plan page of ${student}`,
            async () => {
                await schoolAdminGoesToIndividualStudyPlan(this.cms, this.scenario, student);
            }
        );

        return await this.cms.instruction(
            `School admin sees study plan items values unchanged in individual study plan of ${student}`,
            async (cms) => {
                await schoolAdminWaitingStudyPlanDetailLoading(cms);
                await schoolAdminSeesStudyPlanBulkItemValuesUnChanged(cms, this.scenario);
            }
        );
    }
);

Then('school admin sees the error messages of Start and Due fields', function () {
    return this.cms.instruction(
        'see the error messages',
        schoolAdminSeesStartDueOutOfAvailableDate
    );
});

When(
    'school admin enters {string} date that is later than {string}',
    function (
        field: Extract<StudyPlanItemDateField, 'Available From' | 'Start Date'>,
        otherField: Extract<StudyPlanItemDateField, 'Available Until' | 'Due Date'>
    ) {
        return this.cms.instruction(`enter ${field} date later than ${otherField}`, (cms) =>
            schoolAdminEntersFieldLaterThanOtherField(cms, field, otherField)
        );
    }
);

Then(
    'school admin sees the error messages of {string} and {string}',
    function (
        field: Extract<StudyPlanItemDateField, 'Available From' | 'Start Date'>,
        otherField: Extract<StudyPlanItemDateField, 'Available Until' | 'Due Date'>
    ) {
        return this.cms.instruction(
            `see error messages of ${field} and ${otherField} fields`,
            (cms) => schoolAdminSeesErrorFieldAndOtherField(cms, field, otherField)
        );
    }
);

When('school admin enters {string} into the date fields', function (valueType: ValueType) {
    return this.cms.instruction(`enter ${valueType} into the date fields`, (cms) =>
        schoolAdminEntersStudyPlanItemValueByType(cms, valueType)
    );
});

Then('school admin sees the error messages of each field', function () {
    return this.cms.instruction(
        'see the error messages of each field',
        schoolAdminSeesErrorMessageEachField
    );
});

When('school admin cancels study plan item edits', function () {
    return this.cms.instruction('cancel study plan item editing', (cms) =>
        schoolAdminBulkActionStudyPlanItems(cms, 'cancel')
    );
});

Then('school admin sees the study plan item values unchanged', async function () {
    const originalValues = this.scenario.get<string[]>(aliasStudyPlanItemValues).join(', ');
    const currentValues = (await getFirstStudyPlanItemValues(this.cms)).join(', ');

    await this.cms.instruction(
        `see the study plan item values unchanged: ${originalValues} vs. ${currentValues}`,
        (cms) => schoolAdminSeesStudyPlanItemValuesUnchanged(cms, this.scenario)
    );
});

Then(
    'school admin sees the {string} and {string} values of the study plan items unchanged',
    async function (
        field: Extract<StudyPlanItemDateField, 'Available From' | 'Start Date'>,
        otherField: Extract<StudyPlanItemDateField, 'Available Until' | 'Due Date'>
    ) {
        const originalValues = this.scenario.get<string[]>(aliasStudyPlanItemValues).join(', ');
        const currentValues = (await getFirstStudyPlanItemValues(this.cms)).join(', ');

        await this.cms.instruction(
            `see the ${field} and ${otherField} values of the study plan item unchanged: ${originalValues} vs. ${currentValues}`,
            (cms) => schoolAdminSeesStudyPlanItemValuesUnchanged(cms, this.scenario)
        );
    }
);

When(
    'school admin enters {string} into the fields with {string}',
    function (values: 'date' | 'date and time', year: 'current year' | 'another year') {
        const fields: StudyPlanItemDateField[] = getRandomElements([
            'Available From',
            'Available Until',
            'Start Date',
            'Due Date',
        ]);

        this.scenario.set(aliasEnteredStudyPlanItemFields, fields);
        this.scenario.set(aliasStudyPlanItemYear, year);

        return this.cms.instruction(`enter dates for ${fields.join(', ')} fields`, (cms) =>
            schoolAdminEntersRandomStudyPlanItemFields(cms, { values, fields, year })
        );
    }
);

When(
    'school admin modifies that {string} available for studying in study plan details page',
    async function (loType: LOType) {
        try {
            const courseName = this.scenario.get(aliasCourseName);
            const studyPlanName = this.scenario.get(aliasStudyPlanName);

            await this.cms.instruction(
                'school admin go to course study plan detail page',
                async () => {
                    await schoolAdminGoToStudyPlanDetail(
                        this.cms,
                        'master',
                        courseName,
                        studyPlanName
                    );
                }
            );
        } catch {
            const studyPlanId = this.scenario.get(aliasStudyPlanId);
            const courseId = this.scenario.get(aliasCourseId);

            await this.cms.instruction(
                `school admin navigates to study plan detail page via url`,
                async () => {
                    await schoolAdminGoToStudyPlanDetailViaUrl(this.cms, studyPlanId, courseId);
                }
            );
        }

        await this.cms.instruction('click the edit button', schoolAdminEditsStudyPlanItems);

        await this.cms.instruction(
            'school admin update created study plan item for available',
            async () => {
                const name = getNameByLoType(this.scenario, loType);

                await schoolAdminModifiesStudyPlanItemsForAvailable(this.cms, name);
            }
        );

        await this.cms.instruction('press the save button and confirm the dialog', async () =>
            schoolAdminSavesStudyPlanItems(this.cms, this.scenario)
        );
    }
);

When(
    'school admin enters value into Start field with {string}',
    function (year: 'current year' | 'another year') {
        const fields: StudyPlanItemDateField[] = ['Start Date'];

        this.scenario.set(aliasEnteredStudyPlanItemFields, fields);
        this.scenario.set(aliasStudyPlanItemYear, year);

        return this.cms.instruction('enter date for Start field', (cms) =>
            schoolAdminEntersRandomStudyPlanItemFields(cms, {
                values: 'date and time',
                fields,
                year,
            })
        );
    }
);

Then('school admin sees the values of the study plan items changed correctly', function () {
    const changedFields: string[] = this.scenario.get<StudyPlanItemDateField[]>(
        aliasEnteredStudyPlanItemFields
    );

    return this.cms.instruction(
        `see the ${changedFields.join(', ')} values changed`,
        async (cms) => {
            await schoolAdminWaitingStudyPlanDetailLoading(cms);
            await schoolAdminSeesStudyPlanItemValuesChanged(cms, this.scenario);
        }
    );
});

Then('school admin sees the individual study plan items updated respectively', function () {
    const changedFields: string[] = this.scenario.get<StudyPlanItemDateField[]>(
        aliasEnteredStudyPlanItemFields
    );
    const courseName = this.scenario.get(aliasCourseName);
    const studyPlanName = this.scenario.get(aliasStudyPlanName);

    return this.cms.instruction(
        `see the ${changedFields.join(', ')} values of the individual study plan changed`,
        async (cms) => {
            await goToStudyPlanDetailsFromBreadcrumb(cms, courseName, studyPlanName, 'individual');
            await schoolAdminWaitingStudyPlanDetailLoading(cms);
            await schoolAdminSeesIndividualStudyPlanItemsChanged(cms, this.scenario);
        }
    );
});

Then(
    'school admin sees the Due date of the study plan items automatically filled with seven days from Start date',
    function () {
        return this.cms.instruction(
            'see Due date set to seven days later from Start date',
            schoolAdminSeesDueDateSevensDayLater
        );
    }
);

Then('school admin sees the values of the course study plan items unaffected', function () {
    const courseName = this.scenario.get(aliasCourseName);
    const studyPlanName = this.scenario.get(aliasStudyPlanName);

    return this.cms.instruction(
        `see the item values of the ${studyPlanName} course study plan unaffected`,
        async () => {
            await goToStudyPlanDetailsFromBreadcrumb(this.cms, courseName, studyPlanName, 'master');
            await schoolAdminWaitingStudyPlanDetailLoading(this.cms);
            await schoolAdminSeesCourseStudyPlanItemEmptyTimes(this.cms);
        }
    );
});

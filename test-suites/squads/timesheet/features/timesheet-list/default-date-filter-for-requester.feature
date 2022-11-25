@cms @cms2
@timesheet
@timesheet-list-requestor

Feature: Timesheet list with only the date filter applied
    Background:
        Given "school admin" logins CMS
        And school admin has created a requestor
        And "school admin" creates 5 timesheet for this staff
        And staff logins CMS
    Scenario: Timesheet list at default date filter
        When "teacher" goes to timesheet management page
        Then "teacher" sees date filter is from the first to the last day of current month
        And "teacher" sees the table is filtered by the default date filter
        And "teacher" sees the table is sorted by the latest date on top
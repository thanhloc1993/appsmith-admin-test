@cms @cms2
@timesheet
@timesheet-list-requestor

Feature: Timesheets state change for requestor
    Background:
        Given "school admin" logins CMS
        And school admin has created a requestor
        And "school admin" enables auto-create flag for that requestor
        And "school admin" creates a draft timesheet "1" for yesterday
        And "school admin" creates a draft timesheet "2" for today
        And "school admin" creates a completed lesson "A" for timesheet "2"
        And staff logins CMS
        And "teacher" goes to timesheet management page

    Scenario: Switch states timesheet 1 without reverse
        When "teacher" goes to the timesheet "1" detail page
        And "teacher" clicks "Submit" button
        Then "teacher" sees the timesheet state changed correctly to "Submitted"
        And "teacher" does not see the "Approve" button
        And "teacher" sees the "Edit" button is disabled
        And "teacher" sees the "Delete" button is enabled

    Scenario: Switch states timesheet 2 without reverse
        When "teacher" goes to the timesheet "2" detail page
        And "teacher" clicks "Submit" button
        Then "teacher" sees the timesheet state changed correctly to "Submitted"
        And "teacher" does not see the "Approve" button
        And "teacher" sees the "Edit" button is disabled
        And "teacher" sees the "Delete" button is disabled

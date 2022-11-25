@cms @cms2
@timesheet
@timesheet-list-requestor
@timesheet-list-approver

Feature: Timesheets state changing
    Background:
        Given "school admin" logins CMS
        And school admin has created a requestor
        And "school admin" creates 1 timesheet "1" with "Draft" status
        And "school admin" creates 1 timesheet "2" with "Approved" status
        And staff logins CMS
        And "teacher" goes to timesheet management page
        And "school admin" goes to timesheet management page

    Scenario: Approver switch and reverse states sequentially
        When "school admin" goes to the timesheet "2" detail page
        And "school admin" clicks "Cancel Approval" button
        And "school admin" clicks "Approve" button
        And "school admin" clicks "Cancel Approval" button
        And "school admin" clicks "Cancel Submission" button
        And "school admin" clicks "Submit" button
        And "school admin" clicks "Cancel Submission" button
        And "teacher" goes to the timesheet "2" detail page
        Then "school admin" sees the timesheet state changed correctly to "Draft"
        And "teacher" sees the timesheet state changed correctly to "Draft"

    Scenario: Requestor switch and reverse states sequentially
        When "teacher" goes to the timesheet "1" detail page
        And "teacher" clicks "Submit" button
        And "teacher" clicks "Cancel Submission" button
        And "teacher" clicks "Submit" button
        And "school admin" goes to the timesheet "1" detail page
        Then "school admin" sees the timesheet state changed correctly to "Submitted"
        And "teacher" sees the timesheet state changed correctly to "Submitted"
        And "teacher" does not see the "Approve" button
        And "teacher" does not see the "Cancel Approval" button
        And "teacher" sees the "Edit" button is disabled

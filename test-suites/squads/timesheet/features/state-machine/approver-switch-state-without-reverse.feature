@cms
@timesheet
@timesheet-list-approver

Feature: Timesheets state change

    Scenario: Switch states without reverse
        Given "school admin" logins CMS
        And school admin has created a requestor
        And "school admin" creates a draft timesheet "1" for today
        And "school admin" goes to timesheet management page
        When "school admin" goes to the timesheet "1" detail page
        And "school admin" clicks "Submit" button
        And "school admin" clicks "Approve" button
        Then "school admin" sees the timesheet state changed correctly to "Approved"

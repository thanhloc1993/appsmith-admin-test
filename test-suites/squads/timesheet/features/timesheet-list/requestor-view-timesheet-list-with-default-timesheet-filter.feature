@cms @cms2
@timesheet
@timesheet-list-requestor

Feature: Status filter only
    Background:
        Given "school admin" logins CMS
        And school admin has created a requestor
        And "school admin" creates 1 timesheet with "Draft" status
        And "school admin" creates 1 timesheet with "Submitted" status
        And "school admin" creates 1 timesheet with "Approved" status
        And staff logins CMS

    Scenario Outline: The number count in <status> tab matches the table list
        When "teacher" goes to timesheet management page
        And "teacher" selects timesheet "<status>" tab
        And "teacher" changes the rows per page to 25
        And "teacher" goes to the last page of the timesheet table
        Then "teacher" sees the timesheet count of "<status>" tab is matching with total rows in timesheet list

        Examples:
            | status    |
            | Draft     |
            | Submitted |
            | Approved  |
            | Confirmed |
            | All       |

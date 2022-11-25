@cms @cms2
@timesheet
@timesheet-list-requestor

Feature: Timesheet date and status filters simultaneously
    Background:
        Given "school admin" logins CMS
        And school admin has created a requestor
        And "school admin" creates 1 timesheet with "Draft" status
        And "school admin" creates 1 timesheet with "Submitted" status
        And "school admin" creates 1 timesheet with "Approved" status
        And staff logins CMS
        And "teacher" goes to timesheet management page

    Scenario Outline: "teacher" selects <status> filter and then applies the filter date
        When "teacher" selects timesheet "<status>" tab
        And "teacher" applies the timesheet date filter
        Then "teacher" sees tab "<status>" is selected
        And "teacher" sees all timesheets in results match the selected status and date
        Examples:
            | status    |
            | Draft     |
            | Submitted |
            | Approved  |
            | Confirmed |
            | All       |

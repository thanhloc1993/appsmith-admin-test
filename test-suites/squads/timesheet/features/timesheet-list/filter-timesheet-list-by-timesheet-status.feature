@cms
@timesheet
@timesheet-list-approver

Feature: Approver filters timesheet list by timesheet status

    Scenario: Filter timesheet list by default status
        Given "school admin" logins CMS
        When "school admin" navigates to timesheet management page
        Then "school admin" sees tab "All" is selected
        And "school admin" sees the total number of timesheets on the All status tab
        And "school admin" sees the table is sorted by the latest date on top

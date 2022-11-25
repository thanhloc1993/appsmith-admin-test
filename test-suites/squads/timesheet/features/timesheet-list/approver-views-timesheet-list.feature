@cms
@timesheet
@timesheet-list-approver

Feature: Approver views timesheet list
    Background:
        Given "school admin" logins CMS
        And school admin has created a requestor
        And "school admin" goes to timesheet management page

    Scenario: Approve button is enabled when page changes
        # default rows per page is 10
        And "school admin" has created 11 timesheet(s) with "Submitted" status
        And "school admin" clicks on timesheet "Submitted" tab
        When "school admin" selects 2 row(s) on the timesheet table list
        And "school admin" goes to the next page
        Then "school admin" sees the Approve button is enabled

    Scenario: View table columns
        And "school admin" has created 1 timesheet(s) with "Submitted" status
        And "school admin" clicks on timesheet "Submitted" tab
        Then "school admin" sees the timesheet list table has correct label and order of columns

    Scenario Outline: Select <column> hyperlink for a timesheet
        And "school admin" has created 1 timesheet(s) with "Submitted" status
        And "school admin" clicks on timesheet "Submitted" tab
        When "school admin" clicks the "<column>" hyperlink for a timesheet row
        Then "school admin" is redirected to "<page>" page on a new tab
        Examples:
            | column | page             |
            | Date   | Staff Detail     |
            | Name   | Timesheet Detail |

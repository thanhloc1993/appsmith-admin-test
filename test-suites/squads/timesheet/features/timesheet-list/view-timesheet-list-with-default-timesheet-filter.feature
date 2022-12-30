@cms
@timesheet
@timesheet-list-approver

Feature: Timesheet list with date filter only
    Background:
        Given "school admin" logins CMS
        And "school admin" goes to timesheet management page
    Scenario: "school admin" applies default filter
        When "school admin" clicks the filter button
        Then "school admin" sees date filter is from the first to the last day of current month
        And "school admin" sees the table is filtered by the default date filter
        And "school admin" sees the table is sorted by the latest date on top
        And "school admin" does not see the date filter chip

    Scenario Outline: Row counting on page and status tab after date filtering on <status> tab
        When "school admin" applies new date filter
        And "school admin" selects timesheet "<status>" tab
        And "school admin" changes the rows per page to 25
        And "school admin" goes to the last page of the timesheet table
        Then "school admin" sees the timesheet count of "<status>" tab is matching with total rows in timesheet list
        Examples:
            | status    |
            | Draft     |
            | Submitted |
            | Approved  |
            | Confirmed |
            | All       |

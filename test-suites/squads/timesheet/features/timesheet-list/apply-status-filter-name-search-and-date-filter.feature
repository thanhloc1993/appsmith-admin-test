@cms
@timesheet
@timesheet-list-approver

Feature: Combine Searching & applied filter
    Background:
        Given "school admin" logins CMS
        And "school admin" goes to timesheet management page
    # @blocker
    Scenario Outline: "school admin" selects <status> filter, searches timesheets by <staff name> and then applies the filter date
        When "school admin" selects timesheet "<status>" tab
        And "school admin" searches timesheet by "<staff name>"
        And "school admin" applies the timesheet date filter
        Then "school admin" sees tab "<status>" is selected
        And "school admin" sees from date and to date chip filters in result page
        And "school admin" sees all the timesheet in results match the selected status, staff name and date
        Examples:
            | status    | staff name |
            | Draft     | e2e        |
            | Submitted | e          |
            | Approved  | 2e         |
            | Confirmed | e2         |
            | All       | e2e        |

@cms
@timesheet
@timesheet-list-approver

Feature: Search timesheet by staff name
    Background:
        Given "school admin" logins CMS
        And "school admin" goes to timesheet management page
    Scenario Outline: "school admin" search timesheet by <partial name>
        When "school admin" searches timesheet by "<partial name>"
        Then "school admin" sees all the timesheets in the results match the input staff name
        Examples:
            | partial name |
            | e2e          |
            | e            |
            | 2e           |
            | e2           |
            | @manabie.com |

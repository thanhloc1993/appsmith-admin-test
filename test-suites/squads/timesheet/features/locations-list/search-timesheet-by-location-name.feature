@cms
@timesheet
@timesheet-locations-list

Feature: Search timesheet by location name

    Scenario Outline: Search location by <partial keyword>
        Given "school admin" logins CMS
        And "school admin" has created timesheets for a staff
        And "school admin" goes to timesheet confirmation page
        When "school admin" searches for "timesheets" with location keyword "<partial keyword>" on timesheet confirmation page
        Then "school admin" sees the list of locations match with the search keyword "<partial keyword>"
        And "school admin" sees the "Not Confirmed" location rows shown on top of the location table list
        Examples:
            | partial keyword |
            | Timesheet       |
            | Time            |
            | sheet           |

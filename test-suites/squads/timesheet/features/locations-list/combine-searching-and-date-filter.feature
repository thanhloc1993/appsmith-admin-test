@cms
@timesheet
@timesheet-locations-list

Feature: Combine searching and date filter

    Scenario: Filter date first, then search location
        Given "school admin" logins CMS
        And "school admin" goes to timesheet confirmation page
        And "school admin" has applied a date filter for the locations table list
        When "school admin" goes to the next page
        And "school admin" searches for "locations" with location keyword "timesheet_e2e_" on timesheet confirmation page
        Then "school admin" sees the table turn back to the first page
        And "school admin" sees the list of locations match with the search keyword "timesheet_e2e_"
        And "school admin" sees the "Not Confirmed" location rows shown on top of the location table list

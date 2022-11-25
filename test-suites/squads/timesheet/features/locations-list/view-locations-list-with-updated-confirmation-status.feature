@cms
@timesheet
@timesheet-locations-weekly

Feature: View locations list with updated confirmation status
    Background:
        Given "school admin" logins CMS
        And school admin has created a requestor
        And "school admin" creates 5 new locations with prefix "timesheet_e2e_"

    Scenario: School admin sees confirmation status from location changed from "Not Confirmed" to "Confirmed"
        When "school admin" creates 1 timesheet with "Approved" status for 2 new random locations with prefix "timesheet_e2e_"
        And "school admin" creates 1 timesheet with "Draft" status for 1 new random locations with prefix "timesheet_e2e_"
        And "school admin" goes to timesheet confirmation page
        And "school admin" searches for new locations with prefix "timesheet_e2e_" on timesheet confirmation page
        And "school admin" selects all valid rows on the location list table
        And "school admin" confirms selected locations
        Then "school admin" sees message "You have confirmed the timesheet successfully!"
        And "school admin" sees recently confirmed rows with confirmation status "Confirmed"
        And "school admin" sees 4 row(s) with confirmation status "Confirmed"
        And "school admin" sees 1 row(s) with confirmation status "Not Confirmed"
        And "school admin" sees the "Not Confirmed" location rows shown on top of the location table list
        And "school admin" archives new locations with prefix "timesheet_e2e_"

    Scenario: School admin sees confirmation status from location changed from "Confirmed" to "Not Confirmed"
        When "school admin" creates 1 timesheet with "Draft" status for 2 new random locations with prefix "timesheet_e2e_"
        And "school admin" goes to timesheet confirmation page
        And "school admin" searches for new locations with prefix "timesheet_e2e_" on timesheet confirmation page
        Then "school admin" sees new location rows with confirmation status "Not Confirmed"
        And "school admin" sees the "Not Confirmed" location rows shown on top of the location table list
        And "school admin" sees 3 row(s) with confirmation status "Confirmed"
        And "school admin" archives new locations with prefix "timesheet_e2e_"

@cms @cms2
@timesheet
@timesheet-detail-page

Feature: Users can cancel any submitted timesheets
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS

    Scenario Outline: <user> cancels a submitted timesheet without lesson hours
        And "school admin" creates and submits timesheet "1" without lesson hours
        And "<user>" goes to timesheet management page
        And "<user>" goes to the timesheet "1" detail page
        When "<user>" clicks "Cancel Submission" button
        Then "<user>" sees message "You have successfully cancelled the submission. Timesheet is now in Draft."
        And "<user>" sees the timesheet state changed correctly to "Draft"
        Examples:
            | user         |
            | school admin |
            | teacher      |

    Scenario Outline: <user> cancels a submitted timesheet with <lesson status> lesson
        And "school admin" enables auto-create flag for that requestor
        And "school admin" creates and submits timesheet "2" with "<lesson status>" lesson "A"
        And "<user>" goes to timesheet management page
        And "<user>" goes to the timesheet "2" detail page
        When "<user>" clicks "Cancel Submission" button
        Then "<user>" sees message "You have successfully cancelled the submission. Timesheet is now in Draft."
        And "<user>" sees the timesheet state changed correctly to "Draft"
        Examples:
            | user         | lesson status |
            | school admin | Completed     |
            | teacher      | Cancelled     |

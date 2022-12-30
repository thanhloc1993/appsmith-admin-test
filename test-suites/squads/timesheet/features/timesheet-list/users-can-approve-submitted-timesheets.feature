@cms
@timesheet
@timesheet-list-approver

Feature: Users can approve submitted timesheets
    Background:
        Given "school admin" logins CMS
        And school admin has created a requestor
        And "school admin" grants locations to that requestor
        And "school admin" enables auto-create flag for that requestor
        And "school admin" creates and submits timesheet "1" without lesson hours
        And "school admin" creates and submits timesheet "2" with cancelled lesson "A"
        And "school admin" creates and submits timesheet "3" with cancelled lesson "B"
        And "school admin" reverts cancelled lesson "B" of timesheet "3" to published
        And "school admin" creates and submits timesheet "4" with cancelled lessons "C" and "D"
        And "school admin" reverts cancelled lesson "C" of timesheet "4" to published

    # @blocker
    Scenario: Approved multi submitted timesheets
        When "school admin" navigates to timesheet management page
        And "school admin" selects timesheet "Submitted" tab
        And "school admin" searches timesheets for that requestor
        And "school admin" selects all valid rows on the timesheet list table
        Then "school admin" sees timesheet "1" and "2" is selected
        And "school admin" sees timesheet "3" and "4" is not selected
        And "school admin" approves the selected timesheets
        And "school admin" sees message "You have approved the timesheet successfully!"
        And "school admin" sees timesheet "1" and "2" status changed to Approved
        And "school admin" sees timesheet "3" and "4" status remained as Submitted

@cms @cms2
@timesheet
@timesheet-detail-page

Feature: Submit a timesheet with lesson info
    Background:
        Given "school admin" logins CMS
        And school admin has created a requestor
        And "school admin" enables auto-create flag for that requestor
        And "school admin" creates a draft timesheet "1" for today
        And "school admin" creates a completed lesson "A" for timesheet "1"
        And staff logins CMS
        And "teacher" goes to timesheet management page
        And "school admin" goes to timesheet management page

    Scenario: Submit a timesheet with lesson info
        When "school admin" goes to the timesheet "1" detail page
        And "teacher" goes to the timesheet "1" detail page
        And "school admin" clicks "Submit" button
        And "teacher" reloads page
        Then "school admin" sees message "You have submitted the timesheet successfully!"
        And "school admin" sees the timesheet state changed correctly to "Submitted"
        And "teacher" sees the timesheet state changed correctly to "Submitted"

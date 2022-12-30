@cms @cms2
@timesheet
@timesheet-detail-page

Feature: Submit a timesheet without lesson info
    Background:
        Given "school admin" logins CMS
        And school admin has created a requestor
        And "school admin" creates a draft timesheet "A" for today
        And staff logins CMS
        And "school admin" goes to timesheet management page
        And "teacher" goes to timesheet management page

    # @blocker
    Scenario: Approver submit a timesheet without lesson info
        When "school admin" goes to the timesheet "A" detail page
        And "teacher" goes to the timesheet "A" detail page
        And "school admin" clicks "Submit" button
        And "teacher" reloads page
        Then "school admin" sees message "You have submitted the timesheet successfully!"
        And "school admin" sees the timesheet state changed correctly to "Submitted"
        And "teacher" sees the timesheet state changed correctly to "Submitted"

    # @blocker
    Scenario: Requestor submit a timesheet without lesson info
        When "teacher" goes to the timesheet "A" detail page
        And "school admin" goes to the timesheet "A" detail page
        And "teacher" clicks "Submit" button
        And "school admin" reloads page
        Then "teacher" sees message "You have submitted the timesheet successfully!"
        And "teacher" sees the timesheet state changed correctly to "Submitted"
        And "school admin" sees the timesheet state changed correctly to "Submitted"

@cms
@timesheet
@timesheet-list-approver

Feature: Approver approves the timesheet

    # @blocker
    Scenario: School admin proceeds to approve a timesheet
        Given "school admin" logins CMS
        And school admin has created a requestor
        And "school admin" creates 1 timesheet with "Submitted" status
        And "school admin" goes to timesheet management page
        And "school admin" clicks on timesheet "Submitted" tab
        When "school admin" selects 1 row(s) on the timesheet table list
        And "school admin" can see the Approve button is enabled
        And "school admin" clicks on the Approve button
        And "school admin" sees the confirmation box with message "1 rows will be approved. Do you want to proceed?"
        And "school admin" proceeds to approve the timesheet(s)
        Then "school admin" sees message "You have approved the timesheet successfully!"

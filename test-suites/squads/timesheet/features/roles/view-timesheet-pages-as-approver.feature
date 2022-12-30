@cms
@timesheet
@timesheet-pages-view-as-approver

Feature: Login with the account assigned as Approver only
    Background:
        Given "school admin" logins CMS
        And school admin has created a user as "approver" with the roles of "School Admin"
        And school admin has created a requestor
        And school admin has logged out CMS

    @blocker
    Scenario: Approver sees approver version of timesheet management page
        When "approver" logs in CMS
        And "approver" creates 1 timesheet with "Draft" status
        And "approver" goes to timesheet management page
        Then "approver" sees menu item "Timesheet Management" on navigation drawer
        And "approver" sees approve timesheet button on timesheet management page
        And "approver" sees column "Name" on timesheet management table
        And "approver" sees column "Email" on timesheet management table
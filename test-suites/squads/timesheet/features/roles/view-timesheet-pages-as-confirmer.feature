@cms
@timesheet
@timesheet-pages-view-as-confirmer

Feature: Login with the account assigned as Confirmer only
    Background:
        Given "school admin" logins CMS
        And school admin has created a user as "confirmer" with the roles of "School Admin"
        And school admin has logged out CMS

    Scenario: Confirmer sees approver version of timesheet management page
        When "confirmer" logs in CMS
        And "confirmer" goes to timesheet management page
        Then "confirmer" sees menu item "Timesheet Management" on navigation drawer
        And "confirmer" sees approve timesheet button on timesheet management page
        And "confirmer" sees column "Name" on timesheet management table
        And "confirmer" sees column "Email" on timesheet management table
        And "confirmer" sees menu item "Timesheet Confirmation" on navigation drawer
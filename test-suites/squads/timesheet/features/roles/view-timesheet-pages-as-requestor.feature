@cms
@timesheet
@timesheet-pages-view-as-requestor

Feature: Login with the account assigned as Requestor only
    Background:
        # need to login first as school admin to have the permissions to create a user and a user group
        Given "school admin" logins CMS
        # the "Teacher" parameter can be a comma separated string stating the roles for the user group
        # e.x "Teacher, Teacher Lead, School Admin"
        And school admin has created a user as "requestor" with the roles of "Teacher"
        # logout after creating our user
        And school admin has logged out CMS

    @blocker
    Scenario: Teacher sees requestor version of timesheet management page
        When "requestor" logs in CMS
        And "requestor" creates a timesheet with "Draft" status
        And "requestor" goes to timesheet management page
        Then "requestor" sees menu item "Timesheet Management" on navigation drawer
        And "requestor" sees create timesheet button on timesheet management page
        And "requestor" does not see "Name" column on timesheet management table
        And "requestor" does not see "Email" column on timesheet management table
        And "requestor" does not see menu item "Timesheet Confirmation" on navigation drawer

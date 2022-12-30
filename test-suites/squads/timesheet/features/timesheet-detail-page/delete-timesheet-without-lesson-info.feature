@cms @cms2
@timesheet
@timesheet-detail-page

Feature: Delete a timesheet without lesson info
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "school admin" creates 1 timesheet with other working hours and remarks
        And "school admin" goes to timesheet management page
        And "school admin" goes to the timesheet detail page of the created timesheet
        And "teacher" goes to the timesheet detail page of the created timesheet

    Scenario: School admin can delete a timesheet without lesson info
        When "school admin" clicks the delete timesheet button
        Then "school admin" sees the confirmation box with message "Do you want to delete the timesheet?"
        And "school admin" deletes the timesheet
        And "school admin" sees message "You have deleted the timesheet successfully!"
        And "school admin" is redirected to "Timesheet Management" page
        And "school admin" does not see the deleted timesheet on the timesheet table list
        And "teacher" does not see the deleted timesheet on the timesheet table list after refresh

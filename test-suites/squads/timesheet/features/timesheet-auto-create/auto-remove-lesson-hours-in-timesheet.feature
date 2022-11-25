@cms @cms2
@timesheet
@timesheet-auto-create

Feature: Auto remove Lesson Hours in Timesheet
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "school admin" enables auto-create flag for that requestor
        And "teacher" creates and publishes 3 lessons for today
        And "teacher" sees 3 lessons are auto-created in today's timesheet
    Scenario: A lesson is deleted or removed
        When "school admin" deletes 2 of 3 created lessons
        Then "school admin" sees the "teacher" today's timesheet only has 1 lesson on the timesheet management page
        And "school admin" sees the "teacher" today's timesheet only has 1 lesson on the timesheet detail page
        And "teacher" sees the today's timesheet only has 1 lesson on the timesheet management page
        And "teacher" sees the today's timesheet only has 1 lesson on the timesheet detail page
    Scenario: A lesson is deleted or removed from a submitted timesheet
        When "school admin" changes all lessons status to Completed in Lesson management
        And "teacher" submits the today's timesheet
        And "school admin" deletes 2 of 3 created lessons
        Then "school admin" sees the "teacher" today's timesheet only has 1 lesson on the timesheet management page
        And "school admin" sees the "teacher" today's timesheet only has 1 lesson on the timesheet detail page
        And "teacher" sees the today's timesheet only has 1 lesson on the timesheet management page
        And "teacher" sees the today's timesheet only has 1 lesson on the timesheet detail page

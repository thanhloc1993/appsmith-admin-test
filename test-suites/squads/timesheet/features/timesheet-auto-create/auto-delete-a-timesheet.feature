@cms @cms2
@timesheet
@timesheet-auto-create

Feature: Auto delete a Timesheet
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "school admin" enables auto-create flag for that requestor
        And "teacher" creates and publishes 4 lessons for today in 4 different locations A, B, C, D
        And "teacher" add other working hours for timesheet "C"
        And "teacher" add other working hours for timesheet "D"
        And "teacher" submits timesheets "B"
        And "teacher" submits timesheets "D"
    Scenario: All lessons are deleted or removed
        When "teacher" deletes the lesson "A"
        And "teacher" changes the lesson "B" status to draft
        And "school admin" deletes the lesson "C"
        And "school admin" changes the lesson "D" status to draft
        Then "teacher" sees that the timesheet "A" deleted
        And "teacher" sees that the timesheet "B" deleted
        And "teacher" sees that the timesheet "C" remained
        And "teacher" sees that the timesheet "D" remained
        And "school admin" sees that the timesheet "A" deleted
        And "school admin" sees that the timesheet "B" deleted
        And "school admin" sees that the timesheet "C" remained
        And "school admin" sees that the timesheet "D" remained

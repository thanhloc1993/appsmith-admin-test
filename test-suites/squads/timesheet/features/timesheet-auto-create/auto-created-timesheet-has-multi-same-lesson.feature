@cms @cms2
@timesheet
@timesheet-auto-create

Feature: Today timesheets auto-created for a Staff in a Location
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "school admin" enables auto-create flag for that requestor
        And "teacher" creates 2 draft lessons for today with start time 10 minutes from now
        And "school admin" creates 2 draft lessons for today with start time 10 minutes from now

    Scenario: Auto-created timesheet has multi-same lesson
        When "teacher" publishes 2 recently created lessons
        And "school admin" publishes 2 recently created lessons
        Then "teacher" sees only 1 timesheet auto created
        And "school admin" sees only 1 timesheet auto created

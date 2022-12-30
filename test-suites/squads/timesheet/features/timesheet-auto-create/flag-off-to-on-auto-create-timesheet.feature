@cms @cms2
@timesheet
@timesheet-auto-create

Feature: Auto create flag change
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "school admin" creates a draft timesheet "M7" for a past date
        And "school admin" creates a draft lesson "F7" for timesheet "M7"
        And "school admin" creates a draft lesson "F8" for a past date
        And "school admin" creates a custom draft lesson "F9" for today with start time 5 to 10 minutes from now
        And "school admin" creates a draft lesson "F10" for a future date
        And "school admin" creates a custom draft lesson "F11" for today with start time 00:00 and end time 23:59

    # @blocker
    Scenario: Flag OFF to ON: Auto-create timesheet
        When "school admin" enables auto-create flag for that requestor
        And "school admin" publishes the following lessons "F7, F8, F9, F10, F11"
        Then "school admin" sees timesheets for lessons "F9, F10" is auto created
        And "teacher" sees timesheets for lessons "F9, F10" is auto created
        And "school admin" sees no lesson hours on timesheet "M7"
        And "teacher" sees no lesson hours on timesheet "M7"

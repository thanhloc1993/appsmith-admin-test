@cms @cms2
@timesheet
@timesheet-auto-create

Feature: Timesheets are not auto-created for draft lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "school admin" enables auto-create flag for that requestor

    # @blocker
    Scenario: Auto-created is not activated by draft lessons
        When "teacher" creates a draft lesson for today with start time for later
        And "teacher" creates a draft lesson for a past date
        And "teacher" creates a draft lesson with a date within 2 months from today
        And "teacher" navigates to timesheet management page
        Then "teacher" sees no timesheets are auto created for draft lessons
        And "school admin" sees no timesheets are auto created from draft lessons for that requestor

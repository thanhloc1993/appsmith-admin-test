@cms @cms2
@lesson
@lesson-report-submit
@ignore

Feature: Teacher can cancel bulk action in individual lesson report of lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher" has gone to detailed lesson info page
        And "teacher" has opened creating "individual" lesson report page

    Scenario Outline: Teacher can cancel using Bulk action setting of student
        Given "teacher" has opened bulk action
        And "teacher" has filled in bulk action with "<option>"
        When "teacher" cancels bulk action
        Then "teacher" sees Attendance Status of students is blank
        Examples:
            | option      |
            | Attend      |
            | Absent      |
            | Late        |
            | Leave Early |
    #missing 2 cases

    Scenario Outline: The previous applied Bulk action is still kept when teacher cancels using Bulk action after that
        Given "teacher" has applied bulk action with "<option1>"
        And "teacher" has opened bulk action
        And "teacher" has filled in bulk action with "<option2>"
        When "teacher" cancels bulk action
        Then "teacher" sees Attendance Status of students is "<option1>"
        Examples:
            | option1     | option2                            |
            | Attend      | 1 of [Absent, Late, Leave Early]   |
            | Absent      | 1 of [Attend, Late, Leave Early]   |
            | Late        | 1 of [Attend, Absent, Leave Early] |
            | Leave Early | 1 of [Attend, Absent, Late]        |
#missing 2 cases
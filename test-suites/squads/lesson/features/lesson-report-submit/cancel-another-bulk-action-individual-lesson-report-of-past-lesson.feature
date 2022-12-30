@cms @cms2
@lesson
@lesson-report-submit
@ignore

Feature: Teacher can cancel another bulk action in individual lesson report of past lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "teacher" has gone to detailed lesson info page
        And "teacher" has opened creating "individual" lesson report page

    Scenario Outline: The previous applied Bulk action is still kept when teacher cancels using Bulk action after that
        Given "teacher" has applied bulk action with "<option1>"
        And "teacher" has opened bulk action
        And "teacher" has filled in bulk action with "<option2>"
        When "teacher" cancels bulk action
        Then "teacher" sees Attendance Status of students is "<option1>"
        Examples:
            | option1           | option2                                                                 |
            | Attend            | 1 of [Absent, Absent (informed), Late, Late (informed), Leave Early]    |
            | Absent            | 1 of [Attend, Absent (informed), Late, Late (informed), Leave Early]    |
            | Absent (informed) | 1 of [Attend, Absent, Late, Late (informed), Leave Early]               |
            | Late              | 1 of [Attend, Absent, Absent (informed), Late (informed) , Leave Early] |
            | Late (informed)   | 1 of [Attend, Absent, Absent (informed), Late, Leave Early]             |
            | Leave Early       | 1 of [Attend, Absent, Absent (informed), Late, Late (informed) ]        |

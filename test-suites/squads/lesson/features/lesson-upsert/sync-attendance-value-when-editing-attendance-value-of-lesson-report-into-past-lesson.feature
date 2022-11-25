@cms @cms2
@lesson
@lesson-upsert
@ignore

Feature: Sync Attendance value when editing attendance value of lesson report into past lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "teacher" has gone to detailed lesson info page
        And "teacher" has opened creating "individual" lesson report page

    Scenario Outline: Sync Attendance value when editing attendance value of lesson report into past lesson
        Given "teacher" has chosen "<option1>" Attendance status of student
        And "teacher" has submitted individual lesson report
        And "teacher" has opened editing individual lesson report
        When "teacher" edits to "<option2>" Attendance status
        Then "teacher" sees "<option2>" Attendance status in detailed lesson report info page
        And "school admin" goes to detailed lesson info page
        And "school admin" sees "<option2>" Attendance value in detailed lesson page
        Examples:
            | option1           | option2                                                                 |
            | Attend            | 1 of [Absent,Absent (informed), Late, Late (informed) , Leave Early]    |
            | Absent            | 1 of [Attend, Absent (informed), Late, Late (informed) , Leave Early]   |
            | Absent (informed) | 1 of [Attend, Absent, Late, Late (informed) , Leave Early]              |
            | Late              | 1 of [Attend, Absent, Absent (informed), Late (informed) , Leave Early] |
            | Late (informed)   | 1 of [Attend, Absent, Absent (informed), Late, Leave Early]             |
            | Leave Early       | 1 of [Attend, Absent, Absent (informed), Late, Late (informed) ]        |

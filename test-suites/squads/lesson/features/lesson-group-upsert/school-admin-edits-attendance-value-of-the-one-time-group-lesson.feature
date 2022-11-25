@cms
@lesson
@lesson-group-upsert

Feature: School Admin can edit Attendance of Student in creating lesson page
    Background:
        Given "school admin" logins CMS
        And "school admin" has gone to lesson management page
        And "school admin" has opened creating lesson page

    Scenario: School admin can see default Attendance value of student
        When "school admin" adds student in lesson page on CMS
        #Attendance: Attendance Status, Attendance Notice, Reason, Attendance Note
        Then "school admin" sees attendance info "Status", "Notice", "Reason", "Note" of students is blank
        And "school admin" sees default Attendance Notice is disable

    Scenario Outline: School admin can edit Attendance of Student in creating group lesson page
        Given "school admin" has added student in lesson page on CMS
        When "school admin" updates "<status>", "<notice>", "<reason>", and "<note>" of student
        Then "school admin" sees Attendance is "<status>", "<notice>", "<reason>", and "<note>" of student
        Examples:
            | status      | notice     | reason             | note             |
            | Attend      |            |                    |                  |
            | Absent      | On the day | Physical condition | medical exam     |
            | Late        | In Advance | Other              | personal errands |
            | Leave Early | No contact | Other              | traffic          |

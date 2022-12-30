@cms
@lesson
@lesson-upsert

Feature: School admin change invalid student to valid student and view student in adding student popup
    Background:
        Given "school admin" logins CMS

    Scenario Outline: School admin change invalid student to valid student and view student in adding student popup
        Given school admin has created a student "student" with "<status1>" status, "1 visible courses"
        And school admin has opened editing student page
        And "school admin" has changed student "<status1>" status to "<status2>" status
        And "school admin" has gone to lesson management page
        And "school admin" has opened creating lesson page
        When "school admin" opens adding student popup
        And "school admin" searches for the student name in student popup
        Then "school admin" sees student which matches student name in search bar
        Examples:
            | status1   | status2   |
            | Withdrawn | Potential |
            | Withdrawn | Enrolled  |
            | Graduated | Potential |
            | Graduated | Enrolled  |
            | LOA       | Potential |
            | LOA       | Enrolled  |

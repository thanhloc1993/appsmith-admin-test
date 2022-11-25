@cms @cms2
@lesson
@lesson-filter

Feature: Teacher can search future lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher" has gone to lesson management page

    Scenario: Teacher can search for a lesson which contains the keyword of student name
        When "teacher" searches for the student name
        Then "teacher" sees newly created lesson containing specific student name

    Scenario: Teacher cannot search for a lesson with non existed keyword of student name
        When "teacher" searches for the non existed keyword
        Then "teacher" sees no result
@cms
@lesson
@lesson-filter

Feature: School admin can search future lesson
    Background:
        Given "school admin" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "school admin" has gone to lesson management page

    Scenario: School admin can search for a lesson which contains the keyword of student name
        When "school admin" searches for the student name
        Then "school admin" sees newly created lesson containing specific student name

    Scenario: School admin cannot search for a lesson with non existed keyword of student name
        When "school admin" searches for the non existed keyword
        Then "school admin" sees no result
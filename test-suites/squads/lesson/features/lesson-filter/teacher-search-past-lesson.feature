@cms @cms2
@lesson
@lesson-filter

Feature: Teacher can search past lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "teacher" has gone to "past" lessons list page

    Scenario: Teacher can search for a lesson which contains the keyword of student name
        When "teacher" searches for the student name
        Then "teacher" sees newly created lesson containing specific student name

    Scenario: Teacher cannot search for a lesson with non existed keyword of student name
        When "teacher" searches for the non existed keyword
        Then "teacher" sees no result
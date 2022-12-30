@cms
@lesson
@lesson-upsert

Feature: School admin can search center in center field
    Background:
        Given "school admin" logins CMS
        And school admin has imported location master data

    Scenario: School admin can search center in center field in creating lesson page
        Given "school admin" has gone to lesson management page
        And "school admin" has opened creating lesson page
        When "school admin" searches for the center name
        And "school admin" selects a center
        Then "school admin" sees center in center field

    Scenario: School admin can search center in center field in editing lesson page
        Given school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" searches for the center name
        And "school admin" clears searched center in center field
        And "school admin" searches for the center name again
        And "school admin" selects a center
        Then "school admin" sees center in center field

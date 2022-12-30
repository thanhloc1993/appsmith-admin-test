@cms @teacher @learner
@lesson
@lesson-upsert
@ignore

Feature: Create future and past lesson with offline teaching medium
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And "school admin" has gone to lesson management page
        And "school admin" has opened creating lesson page

    Scenario: School admin can create future lesson with all fields
        #all fields: lesson date, start time, end time, teaching medium, teaching method, teacher, student, center
        Given "school admin" has filled date & time is within 10 minutes from now
        #all remain fields: teaching method, teacher, student, center
        And "school admin" has filled all remain fields
        And "school admin" has filled offline teaching medium
        When "school admin" creates the lesson of lesson management
        Then "school admin" is redirected to "future" lessons list page
        And "school admin" sees newly created "future" lesson on the list
        And "teacher" does not see new "future" lesson on Teacher App
        And "student" does not see the new lesson on Learner App

    Scenario: School admin can create past lesson with all fields
        #need refactor some step context
        #all fields: lesson date, start time, end time, teaching medium, teaching method, teacher, student, center
        Given "school admin" has filled start & end time have been completed in the last 24 hours
        #all remain fields: teaching method, teacher, student, center
        And "school admin" has filled all remain fields
        And "school admin" has filled offline teaching medium
        When "school admin" creates the lesson of lesson management
        Then "school admin" is redirected to "past" lessons list page
        And "school admin" sees newly created "past" lesson on the list
        And "teacher" does not see new "past" lesson on Teacher App
        And "student" does not see the new lesson on Learner App

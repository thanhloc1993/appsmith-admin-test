@cms @cms2 @teacher @learner
@lesson
@lesson-upsert
@ignore

Feature: Teacher create future and past lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And "teacher" has gone to lesson management page
        And "teacher" has opened creating lesson page

    Scenario: Teacher can create future lesson with all fields
        #all fields: lesson date, start time, end time, teaching medium, teaching method, teacher, student, center
        Given "teacher" has filled date & time is within 10 minutes from now
        #all remain fields: teaching medium, teaching method, teacher, student, center
        And "teacher" has filled all remain fields
        When "teacher" creates the lesson of lesson management
        Then "teacher" is redirected to "future" lessons list page
        And "teacher" sees newly created "future" lesson on the list
        And "teacher" sees new "future" lesson on Teacher App
        And "student" sees the new lesson on Learner App

    Scenario: Teacher can create past lesson with all fields
        #all fields: lesson date, start time, end time, teaching medium, teaching method, teacher, student, center
        Given "teacher" has filled start & end time have been completed in the last 24 hours
        And "teacher" has filled all remain fields
        #all remain fields: teaching medium, teaching method, teacher, student, center
        When "teacher" creates the lesson of lesson management
        Then "teacher" is redirected to "past" lessons list page
        And "teacher" sees newly created "past" lesson on the list
        And "teacher" sees new "past" lesson on Teacher App
        And "student" sees the new lesson on Learner App

    Scenario Outline: Teacher cannot create the lesson with missing required <field>
        When "teacher" creates the lesson with missing required "<field>"
        Then "teacher" sees alert message under required "<field>"
        And "teacher" is still in creating lesson page
        Examples:
            | field      |
            | start time |
            | end time   |
            | center     |

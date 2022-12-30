@cms @learner
@lesson
@lesson-upsert

Feature: Cannot create lesson with student has multiple courses
    Background:
        Given "school admin" logins CMS
        And "student" with enrolled status has logged Learner App
        And "school admin" has added course C1 for "student"
        And "school admin" has added course C2 for "student"
        And "school admin" has gone to lesson management page
        And "school admin" has opened creating lesson page

    Scenario: Cannot create lesson with student has multiple courses
        Given "school admin" has added "student" with course C1
        And "school admin" has added "student" with course C2
        And "school admin" has filled all remain fields exclude student field
#        #all remain fields: lesson date, start time, end time, teaching medium, teaching method, teacher, center
        When "school admin" clicks save button of lesson management
        Then "school admin" sees error message
        And "school admin" is still in creating lesson page

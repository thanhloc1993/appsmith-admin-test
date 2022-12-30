@cms @teacher @learner
@lesson
@lesson-upsert
@ignore

Feature: Create future and past lesson with online teaching medium
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And "school admin" has gone to lesson management page
        And "school admin" has opened creating lesson page

    Scenario: School admin can create future lesson with all fields
        #all fields: lesson date, start time, end time, teaching medium, teaching method, teacher, student, center
        Given "school admin" has filled date & time is within 10 minutes from now
        #all remain fields: teaching medium, teaching method, teacher, student, center
        And "school admin" has filled all remain fields
        When "school admin" creates the lesson of lesson management
        Then "school admin" is redirected to "future" lessons list page
        And "school admin" sees newly created "future" lesson on the list
        And "teacher" sees new "future" lesson on Teacher App
        And "student" sees the new lesson on Learner App

    # TODO: Implement when it's possible to create the lesson without students and teachers
    # Scenario: School admin can create future lesson with all required fields
    #     #required fields: lesson date, start time, end time, teaching medium, teaching method, center
    #     Given "school admin" has filled date & time is within 10 minutes from now
    #     And "school admin" fills remain required fields
    #     #remain required fields: teaching medium, teaching method, center
    #     When "school admin" creates the lesson
    #     Then "school admin" is redirected to "future lessons list" page
    #     And "school admin" sees newly created lesson
    #     And "teacher" still sees the lesson on Teacher App
    #     And "student" does not see the lesson on Learner App

    Scenario: School admin can create past lesson with all fields
        #all fields: lesson date, start time, end time, teaching medium, teaching method, teacher, student, center
        Given "school admin" has filled start & end time have been completed in the last 24 hours
        And "school admin" has filled all remain fields
        #all remain fields: teaching medium, teaching method, teacher, student, center
        When "school admin" creates the lesson of lesson management
        Then "school admin" is redirected to "past" lessons list page
        And "school admin" sees newly created "past" lesson on the list
        And "teacher" sees new "past" lesson on Teacher App
        And "student" sees the new lesson on Learner App

    # TODO: Implement when it's possible to create the lesson without students and teachers
    # Scenario: School admin can create past lesson with all required fields
    #     #required fields: lesson date, start time, end time, teaching medium, teaching method, center
    #     Given "school admin" fills date is within yesterday
    #     And "school admin" has filled start & end time have been completed in the last 24 hours
    #     And "school admin" fills remain required fields
    #     #remain required fields: teaching medium, teaching method, center
    #     When "school admin" creates the lesson
    #     Then "school admin" is redirected to "past lessons list" page
    #     And "school admin" sees newly created lesson
    #     And "teacher" still sees the lesson on Teacher App
    #     And "student" does not see the lesson on Learner App

    Scenario Outline: School admin cannot create the lesson with missing required <field>
        When "school admin" creates the lesson with missing required "<field>"
        Then "school admin" sees alert message under required "<field>"
        And "school admin" is still in creating lesson page

        Examples:
            | field      |
            # | lesson date     | // Impossible null
            | start time |
            | end time   |
            # | teaching medium | // Impossible null
            # | teaching method | // Impossible null
            | center     |

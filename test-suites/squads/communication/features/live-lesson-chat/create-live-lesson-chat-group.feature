@cms @learner @teacher
@communication
@live-lesson-chat

Feature: Create live lesson chat group

    Background:
        Given "school admin" logins CMS
        And "student" with course and enrolled status has logged Learner App
        And "teacher" logins Teacher App
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher" has filtered location in location settings on Teacher App with the lesson location

    Scenario: Participants see lesson chat group when teacher starts live lesson before student joins
        Given "teacher" has joined lesson of lesson management on Teacher App
        When "student" joins lesson on Learner App
        Then "teacher" sees lesson chat group is created
        And "student" sees lesson chat group is created

    Scenario: Participants see lesson chat group when student joins live lesson before teacher starts
        Given "student" goes to lesson waiting room on Learner App
        When "teacher" joins lesson of lesson management on Teacher App
        Then "teacher" sees lesson chat group is created
        And "student" sees lesson chat group is created

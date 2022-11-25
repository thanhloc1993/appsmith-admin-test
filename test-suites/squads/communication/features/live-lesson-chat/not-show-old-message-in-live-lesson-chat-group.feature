@cms @learner @teacher
@communication
@live-lesson-chat

Feature: Cannot see old message in lesson chat group after ending lesson for all

    Background:
        Given "school admin" logins CMS
        And "student" with course and enrolled status has logged Learner App
        And "teacher" logins Teacher App
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher" has filtered location in location settings on Teacher App with the lesson location
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario: Participants do not see old message after teacher ended lesson for all
        Given "teacher, student" have sent message in lesson chat group
        And "teacher" has ended lesson for all on Teacher App
        When "teacher" rejoins lesson on Teacher App
        And "student" rejoins lesson on Learner App
        Then "teacher" does not sees old message of the previous session
        And "student" does not sees old message of the previous session

    Scenario: Participants do not see old message after all members leave lesson
        Given "teacher, student" have sent message in lesson chat group
        And all members leave lesson
        When "teacher" rejoins lesson on Teacher App
        And "student" rejoins lesson on Learner App
        Then "teacher" does not sees old message of the previous session
        And "student" does not sees old message of the previous session
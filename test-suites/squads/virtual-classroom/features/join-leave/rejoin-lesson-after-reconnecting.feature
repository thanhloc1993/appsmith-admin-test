@cms @teacher @learner
@virtual-classroom
@virtual-classroom-join-leave

Feature: Rejoin a live lesson after reconnecting
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App
        And "teacher" has turned on speaker and camera on Teacher App
        And "student" has turned on speaker and camera on Learner App
        And "student" has turned on raise hand on Learner App

    Scenario: Teacher can rejoin a lesson after reconnecting
        Given "teacher" has disconnected on Teacher App
        When "teacher" reconnects on Teacher App
        Then "teacher" does not see disconnecting screen on Teacher App
        And "teacher" sees "active" speaker and camera icon on Teacher App
        And "teacher" sees student's stream on Teacher App
        And "student" sees teacher's stream on Learner App
        And "teacher" "can see" active "student"'s raise hand icon in the first position in student list on Teacher App

    Scenario: Student can rejoin a lesson after reconnecting
        Given "student" has been disconnected on Learner App
        When "student" reconnects on Learner App
        Then "student" does not see disconnecting screen on Learner App
        And "student" sees active raise hand icon on Learner App
        And "student" sees "active" speaker and camera icon on Learner App
        And "student" sees teacher's stream on Learner App
        And "teacher" sees student's stream on Teacher App
        And "teacher" "can see" active "student"'s raise hand icon in the first position in student list on Teacher App
@cms @teacher @learner
@virtual-classroom
@virtual-classroom-streaming

Feature: Teacher can see current student's status when teacher leaves then rejoins lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson management with start date&time is more than 10 minutes from now
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario: Teacher can see current active student's mode when teacher leaves then rejoins lesson
        When "teacher" leaves lesson on Teacher App
        And "student" turns on raise hand on Learner App
        And "student" turns on speaker and camera on Learner App
        And "teacher" rejoins lesson on Teacher App
        Then "teacher" "can see" active "student"'s raise hand icon in the first position in student list on Teacher App
        And "teacher" sees active "student" speaker and camera icon in student list on Teacher App
        And "student" sees active raise hand icon on Learner App
        And "student" sees active speaker and camera icon on Learner App

    Scenario: Teacher can see current inactive student's mode when teacher leaves then rejoins lesson
        Given "student" has turned on raise hand on Learner App
        And "student" has turned on speaker and camera on Learner App
        When "teacher" leaves lesson on Teacher App
        And "student" turns off raise hand on Learner App
        And "student" turns off their speaker and camera on Learner App
        And "teacher" rejoins lesson on Teacher App
        Then "teacher" "can not see" active "student"'s raise hand icon in the first position in student list on Teacher App
        And "teacher" sees inactive "student" speaker and camera icon in student list on Teacher App
        And "student" sees inactive raise hand icon on Learner App
        And "student" sees inactive speaker and camera icon on Learner App

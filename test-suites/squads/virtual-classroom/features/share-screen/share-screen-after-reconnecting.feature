@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-share-screen

Feature: Share screen after reconnecting
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson management with start date&time is more than 10 minutes from now
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App
        And "teacher T1" has shared their entire screen on Teacher App

    Scenario: Teacher can not share their screen after reconnecting
        Given "teacher T1" has disconnected on Teacher App
        When "teacher T1" reconnects on Teacher App
        Then "teacher T1" does not share their entire screen anymore
        And "teacher T2" does not see screen which has been shared on Teacher App
        And "student" does not see screen which has been shared on Learner App

    Scenario: Teacher T2 can see current sharing screen after reconnecting
        Given "teacher T2" has disconnected on Teacher App
        When "teacher T2" reconnects on Teacher App
        Then "teacher T2" sees screen which has been shared on Teacher App

    Scenario: student can see current sharing screen after reconnecting
        Given "student" has been disconnected on Learner App
        When "student" reconnects on Learner App
        Then "student" sees screen which has been shared on Learner App
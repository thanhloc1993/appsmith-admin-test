@cms @teacher @learner @teacher2 @learner2
@virtual-classroom
@virtual-classroom-spotlight-stop-and-switch

Feature: Teacher can switch spotlighted user
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student S1, student S2" with course and enrolled status have logged Learner App
        And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student S1, student S2" have joined lesson on Learner App
        And "teacher T2" has turned on their camera on Teacher App

    Scenario Outline: Teacher can switch spotlighted <user1> into <user2> for students
        When "teacher T1" spotlights "<user1>" on Teacher App
        And "teacher T1" spotlights new user "<user2>" on Teacher App
        Then "teacher T1, teacher T2" see "<user2>" stream is covered with white frame in the gallery view on Teacher App
        And "teacher T1, teacher T2" see spotlight icon in "<user2>" stream in the gallery view on Teacher App
        And "student S1, student S2" see "<user2>" stream in the main screen on Learner App
        Examples:
            | user1      | user2      |
            | teacher T1 | teacher T2 |
            | teacher T1 | student S1 |
            | teacher T2 | teacher T1 |
            | teacher T2 | student S1 |
            | student S1 | teacher T2 |
            | student S1 | student S2 |
            | student S1 | teacher T1 |
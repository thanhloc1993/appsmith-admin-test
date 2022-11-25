@cms @teacher @learner @teacher2 @learner2
@virtual-classroom
@virtual-classroom-pin-user

Feature: Teacher can switch pinned user
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student S1, student S2" with course and enrolled status have logged Learner App
        And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student S1, student S2" have joined lesson on Learner App
        And all teachers and students's speaker and camera are "active"

    Scenario Outline: Teacher can switch pinned <user1> into <user2> and does not affect on other teacher and student side
        When "teacher T1" "Pin for me" "<user1>" on Teacher App
        And "teacher T1" "Pin for me" new "<user2>" on Teacher App
        Then "teacher T1" sees "<user2>" stream in the main screen on Teacher App
        And "teacher T1" does not see "<user2>" with camera "active" in the gallery view on Teacher App
        And "teacher T2" sees "teacher T1" with camera "active" in the gallery view on Teacher App
        And "student S1, student S2" see "teacher T1" in the gallery view on Learner App
        Examples:
            | user1      | user2      |
            | teacher T1 | teacher T2 |
            | teacher T1 | student S1 |
# | teacher T2 | teacher T1 |
# | teacher T2 | student S1 |
# | student S1 | teacher T2 |
# | student S1 | student S2 |
# | student S1 | teacher T1 |

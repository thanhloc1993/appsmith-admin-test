@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-pin-user

Feature: Teacher cannot see pinned user when teacher or pinned user leaves lesson then rejoining
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status have logged Learner App
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario Outline: Teacher cannot see pinned user when teacher leaves lesson then rejoining
        Given "teacher T1" has "Pin for me" "<user>" on Teacher App
        When "teacher T1" leaves lesson on Teacher App
        And "teacher T1" rejoins lesson on Teacher App
        Then "teacher T1" does not see "<user>" stream with "camera" in the main screen on Teacher App
        And "teacher T1" sees "<user>" with camera "inactive" in the gallery view on Teacher App
        Examples:
            | user       |
            | teacher T1 |
            | teacher T2 |
            | student    |

    Scenario: Teacher cannot see pinned other teacher when other teacher leaves lesson then rejoining
        Given "teacher T1" has "Pin for me" "teacher T2" on Teacher App
        When "teacher T2" leaves lesson on Teacher App
        And "teacher T2" rejoins lesson on Teacher App
        Then "teacher T1" does not see "teacher T2" stream with "camera" in the main screen on Teacher App
        And "teacher T1" sees "teacher T2" with camera "inactive" in the gallery view on Teacher App

    Scenario: Teacher cannot see pinned student when student leaves lesson then rejoining
        Given "teacher T1" has "Pin for me" "student" on Teacher App
        When "student" leaves lesson on Learner App
        And "student" rejoins lesson on Learner App
        Then "teacher T1" does not see "student" stream with "camera" in the main screen on Teacher App
        And "teacher T1" sees "student" with camera "inactive" in the gallery view on Teacher App
@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-pin-user-streaming

Feature: Teacher does not see pinned user camera when teacher or pinned user disconnects then reconnecting
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status have logged Learner App
        And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App
        And "teacher T2" has turned on their camera on Teacher App
        And "student" has turned on their camera on Learner App

    Scenario Outline: Teacher cannot see pinned user camera when teacher disconnects then reconnecting
        Given "teacher T1" has "Pin for me" "<user>" on Teacher App
        When "teacher T1" disconnects on Teacher App
        And "teacher T1" reconnects on Teacher App
        Then "teacher T1" does not see "<user>" stream with "camera" "active" in the main screen on Teacher App
        And "teacher T1" sees "<user>" with camera "active" in the gallery view on Teacher App
        Examples:
            | user       |
            | teacher T1 |
            | teacher T2 |
            | student    |

    Scenario: Teacher cannot see pinned other teacher camera when other teacher disconnects then reconnecting
        Given "teacher T1" has "Pin for me" "teacher T2" on Teacher App
        When "teacher T2" disconnects on Teacher App
        And "teacher T2" reconnects on Teacher App
        Then "teacher T1" does not see "teacher T2" stream with "camera" "active" in the main screen on Teacher App
        And "teacher T1" sees "teacher T2" with camera "active" in the gallery view on Teacher App

    Scenario: Teacher cannot see pinned student camera when student disconnects then reconnecting
        Given "teacher T1" has "Pin for me" "student" on Teacher App
        When "student" disconnects on Learner App
        And "student" reconnects on Learner App
        Then "teacher T1" does not see "student" stream with "camera" "active" in the main screen on Teacher App
        And "teacher T1" sees "student" with camera "active" in the gallery view on Teacher App
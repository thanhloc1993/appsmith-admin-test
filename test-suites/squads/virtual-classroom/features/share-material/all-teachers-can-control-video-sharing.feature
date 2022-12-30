@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-share-material

Feature: All teachers can control video sharing
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached "video" on CMS
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario: All teachers can see video control bar
        When "teacher T1" shares lesson's video on Teacher App
        Then "teacher T1" sees video control bar on Teacher App
        And "teacher T2" sees video control bar on Teacher App

    Scenario Outline: All teachers can pause video in video control bar
        Given "<user1>" has shared lesson's video on Teacher App
        And "<user1>" has played lesson's video on Teacher App
        When "<user2>" pauses lesson's video on Teacher App
        Then "teacher T1, teacher T2" do not see lesson's video is playing on Teacher App
        And "student" does not see video is playing on Learner App
        Examples:
            | user1      | user2      |
            | teacher T1 | teacher T2 |
            | teacher T2 | teacher T1 |

    Scenario Outline: All teachers can replay video in video control bar
        Given "<user1>" has shared lesson's video on Teacher App
        And "<user1>" has played lesson's video on Teacher App
        And "<user1>" has paused lesson's video on Teacher App
        When "<user2>" replays lesson's video on Teacher App
        Then "teacher T1, teacher T2" see lesson's video is playing on Teacher App
        And "student" sees video is playing on Learner App
        Examples:
            | user1      | user2      |
            | teacher T1 | teacher T2 |
            | teacher T2 | teacher T1 |

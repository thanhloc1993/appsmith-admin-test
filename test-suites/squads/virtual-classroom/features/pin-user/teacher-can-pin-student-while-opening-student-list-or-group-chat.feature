@cms @teacher @learner
@virtual-classroom
@virtual-classroom-pin-user

Feature: Teacher can pin student while they open student list or group chat
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario Outline: Teacher can pin student before teacher opens student list or group chat
        When "teacher" "Pin for me" "student" on Teacher App
        And "teacher" opens "<tab>" by "<icon>" in the main bar on Teacher App
        Then "teacher" sees opening "<tab>" in the right side on Teacher App
        And "teacher" sees "student" stream with "camera" "inactive" in the main screen on Teacher App
        And "teacher" does not see "student" with camera "inactive" in the gallery view on Teacher App
        Examples:
            | tab          | icon              |
            | student list | student list icon |
            | group chat   | group chat icon   |

    Scenario Outline: Teacher can pin student after teacher opens student list or group chat
        When "teacher" opens "<tab>" by "<icon>" in the main bar on Teacher App
        And "teacher" "Pin for me" "student" on Teacher App
        Then "teacher" sees opening "<tab>" in the right side on Teacher App
        And "teacher" sees "student" stream with "camera" "inactive" in the main screen on Teacher App
        And "teacher" does not see "student" with camera "inactive" in the gallery view on Teacher App
        Examples:
            | tab          | icon              |
            | student list | student list icon |
            | group chat   | group chat icon   |

    Scenario Outline: Teacher can see student list or group chat after unpinning student
        Given "teacher" has "Pin for me" "student" on Teacher App
        And "teacher" has opened "<tab>" by "<icon>" in the main bar on Teacher App
        When "teacher" "Unpin" "student" on Teacher App
        Then "teacher" sees opening "<tab>" in the right side on Teacher App
        And "teacher" sees "student" with camera "inactive" in the gallery view on Teacher App
        Examples:
            | tab          | icon              |
            | student list | student list icon |
            | group chat   | group chat icon   |

    Scenario Outline: Teacher can see pinned student in the main screen after hiding student list or group chat
        Given "teacher" has "Pin for me" "student" on Teacher App
        And "teacher" has opened "<tab>" by "<icon>" in the main bar on Teacher App
        When "teacher" hides "<tab>" by "<icon>" in the main bar on Teacher App
        Then "teacher" does not see "<tab>" in the right side on Teacher App
        And "teacher" sees "student" stream with "camera" "inactive" in the main screen on Teacher App
        And "teacher" does not see "student" with camera "inactive" in the gallery view on Teacher App
        Examples:
            | tab          | icon              |
            | student list | student list icon |
            | group chat   | group chat icon   |
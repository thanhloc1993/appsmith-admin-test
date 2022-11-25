@cms
@teacher @teacher2
@learner
@virtual-classroom
@virtual-classroom-spotlight

Feature: Teacher can spotlight and pin user at the same time
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson management with start date&time is more than 10 minutes from now
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App
        And all teachers have seen "inactive" "student" "camera" mode on Teacher App

    Scenario Outline: Specific teacher can spotlight <user> and then pinning <user>
        Given "teacher T1" has spotlighted "<user>" on Teacher App
        When "teacher T1" "Pin for me" "<user>" on Teacher App
        Then "teacher T1" sees "<user>" stream with camera "inactive" in the main screen on Teacher App
        And "teacher T1" sees "<user>" stream is covered with white frame in the main screen on Teacher App
        And "teacher T1" does not see "<user>" with camera "inactive" in the gallery view on Teacher App
        Examples:
            | user       |
            | teacher T2 |
            | student    |

    Scenario Outline: Specific teacher can pin <user> and then spotlight <user>
        Given "teacher T1" has "Pin for me" "<user>" on Teacher App
        When "teacher T1" "Spotlight for students" "<user>" on Teacher App
        Then "teacher T1" sees "<user>" stream with camera "inactive" in the main screen on Teacher App
        And "teacher T1" sees "<user>" stream is covered with white frame in the main screen on Teacher App
        And "teacher T1" does not see "<user>" with camera "inactive" in the gallery view on Teacher App
        Examples:
            | user       |
            | teacher T2 |
            | student    |

    Scenario Outline: Specific teacher can pin <user> then another teacher spotlights <user>
        Given "teacher T1" has "Pin for me" "<user>" on Teacher App
        When "teacher T2" "Spotlight for students" "<user>" on Teacher App
        Then "teacher T1" sees "<user>" stream with camera "inactive" in the main screen on Teacher App
        And "teacher T1" sees "<user>" stream is covered with white frame in the main screen on Teacher App
        And "teacher T1" does not see "<user>" with camera "inactive" in the gallery view on Teacher App
        Examples:
            | user       |
            | teacher T2 |
            | student    |
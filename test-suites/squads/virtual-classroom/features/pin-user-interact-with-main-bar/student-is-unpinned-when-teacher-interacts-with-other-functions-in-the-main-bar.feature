@cms @teacher @learner
@virtual-classroom
@virtual-classroom-pin-user-interact-with-main-bar

Feature: Student is unpinned when teacher interacts with other functions in the main bar on Teacher App
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached materials on CMS
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario Outline: Student is unpinned when teacher shares <material> after pinning student
        When "teacher" "Pin for me" "student" on Teacher App
        And "teacher" shares lesson's "<material>" on Teacher App
        Then "teacher" sees lesson's "<material>" on Teacher App
        And "teacher" sees "student" with camera "inactive" in the gallery view on Teacher App
        And "teacher" sees "active" share material icon on Teacher App
        And "student" sees "<material>" on Learner App
        Examples:
            | material |
            | pdf 1    |
            | video 1  |

    Scenario Outline: Student is unpinned when teacher shares <new file> material after pinning student
        Given "teacher" has shared lesson's "<current file>" on Teacher App
        When "teacher" "Pin for me" "student" on Teacher App
        And "teacher" shares lesson's "<new file>" under gallery view on Teacher App
        Then "teacher" sees lesson's "<new file>" under gallery view on Teacher App
        And "teacher" sees "student" with camera "inactive" in the gallery view on Teacher App
        And "teacher" sees "active" share material icon on Teacher App
        And "student" sees "<new file>" in the main screen on Learner App
        Examples:
            | new file | current file |
            | pdf 2    | pdf 1        |
            | video 2  | video 1      |
            | video 1  | pdf 1        |

@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-pin-user

Feature: Teacher is unpinned when teacher shares or changes material in the main bar on Teacher App
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached materials on CMS
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario Outline: <teacher> is unpinned when teacher shares <material> after pinning <teacher>
        When "teacher T1" "Pin for me" "<teacher>" on Teacher App
        And "teacher T1" shares lesson's "<material>" on Teacher App
        Then "teacher T1" sees lesson's "<material>" on Teacher App
        And "teacher T1" sees "<teacher>" with camera "inactive" in the gallery view on Teacher App
        And "teacher T1" sees "active" share material icon on Teacher App
        And "student" sees "<material>" on Learner App
        Examples:
            | teacher    | material |
            | teacher T1 | pdf 1    |
            | teacher T2 | pdf 1    |
            | teacher T1 | video 1  |
            | teacher T2 | video 1  |

    Scenario Outline: <teacher> is unpinned when teacher shares <new file> material after pinning <teacher>
        Given "teacher T1" has shared lesson's "<current file>" on Teacher App
        When "teacher T1" "Pin for me" "<teacher>" on Teacher App
        And "teacher T1" shares lesson's "<new file>" under gallery view on Teacher App
        Then "teacher T1" sees lesson's "<new file>" under gallery view on Teacher App
        And "teacher T1" sees "<teacher>" with camera "inactive" in the gallery view on Teacher App
        And "teacher T1" sees "active" share material icon on Teacher App
        And "student" sees "<new file>" in the main screen on Learner App
        Examples:
            | teacher    | new file | current file |
            | teacher T1 | pdf 2    | pdf 1        |
            | teacher T1 | video 2  | video 1      |
            | teacher T1 | video 1  | pdf 1        |
            | teacher T2 | pdf 2    | pdf 1        |
            | teacher T2 | video 2  | video 1      |
            | teacher T2 | video 1  | pdf 1        |
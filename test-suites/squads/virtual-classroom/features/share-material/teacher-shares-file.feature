@cms @teacher @learner
@virtual-classroom
@virtual-classroom-share-material

Feature: Teacher can share file
    Background:
        Given "school admin" logins CMS
        And "student" with course and enrolled status has logged Learner App
        And "teacher" logins Teacher App
        And school admin has created a lesson of lesson management with attached materials on CMS
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario Outline: Teacher can share <file>
        When "teacher" shares lesson's "<file>" under gallery view on Teacher App
        Then "teacher" sees sharing lesson's "<file>" under gallery view on Teacher App
        And "teacher" sees "active" share material icon on Teacher App
        And "student" sees sharing "<file>" in the main screen on Learner App
        Examples:
            | file    |
            | pdf 1   |
            | video 1 |

    Scenario Outline: Teacher can stop sharing <file>
        Given "teacher" has shared lesson's "<file>" on Teacher App
        When "teacher" stops sharing material on Teacher App
        Then "teacher" does not see lesson's "<file>" under gallery view on Teacher App
        And "teacher" sees "inactive" share material icon on Teacher App
        And "student" does not see material on Learner App
        Examples:
            | file    |
            | pdf 1   |
            | video 1 |

    Scenario Outline: Teacher can share <new file> while teacher is sharing <current file>
        Given "teacher" has shared lesson's "<current file>" on Teacher App
        When "teacher" shares lesson's "<new file>" under gallery view on Teacher App
        Then "teacher" sees lesson's "<new file>" under gallery view on Teacher App
        And "student" sees "<new file>" in the main screen on Learner App
        Examples:
            | new file | current file |
            | pdf 2    | pdf 1        |
            | video 2  | video 1      |
            | video 1  | pdf 1        |

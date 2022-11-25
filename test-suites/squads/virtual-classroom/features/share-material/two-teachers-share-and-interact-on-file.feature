@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-share-material

Feature: Two teacher can share and interact on file
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached materials on CMS
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario Outline: Other teacher can share <new file> from the beginning while teacher is sharing <current file>
        Given "teacher T1" has shared lesson's "<current file>" on Teacher App
        When "teacher T2" shares lesson's "<new file>" on Teacher App
        Then all teachers see lesson's "<new file>" from the beginning on Teacher App
        And all teachers see "active" share material icon on Teacher App
        And "student" sees "<new file>" from the beginning on Learner App
        Examples:
            | new file | current file |
            | pdf 2    | pdf 1        |
            | video 2  | video 1      |
            | video 1  | pdf 1        |

    Scenario: Other teacher can share pdf from the previous progress while teacher is sharing video
        Given "teacher T1" has changed page of pdf 1 on Teacher App
        And "teacher T1" has shared lesson's "video 1" on Teacher App
        When "teacher T2" shares lesson's "pdf 1" on Teacher App
        Then all teachers see lesson's pdf 1 from the previous page on Teacher App
        And all teachers see "active" share material icon on Teacher App
        And "student" sees pdf 1 from the previous page on Learner App

    Scenario Outline: Teacher can stop the sharing <file> of other teacher
        Given "teacher T1" has shared lesson's "<file>" on Teacher App
        When "teacher T2" stops sharing material on Teacher App
        Then all teachers do not see lesson's "<file>" on Teacher App
        And all teachers see "inactive" share material icon on Teacher App
        And "student" does not see "<file>" on Learner App
        Examples:
            | file    |
            | pdf 1   |
            | video 1 |

@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-white-board-zoom

Feature: Teacher can zoom in and zoom out
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached "pdf" on CMS
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario: All teachers do not see zoom in & out & move controller when sharing pdf
        When "teacher T1" shares lesson's "pdf" on Teacher App
        Then "teacher T1, teacher T2" see default pen tool icon in white board on Teacher App
        And "teacher T1, teacher T2" "can not see" zoom in & out button and move controller on Teacher App

    @blocker
    Scenario: Teacher can see zoom in & out and move controller after change to zoom tool
        When "teacher T1" shares lesson's "pdf" on Teacher App
        And "teacher T1, teacher T2" select zoom tool on Teacher App
        Then "teacher T1, teacher T2" "can see" zoom in & out button and move controller on Teacher App

    Scenario Outline: Teacher can zoom in sharing pdf
        When "teacher T1" shares lesson's "pdf" on Teacher App
        And "teacher T1, teacher T2" select zoom tool on Teacher App
        And "teacher T1" zooms in "<click>" time on Teacher App
        Then "teacher T1, teacher T2" see sharing pdf with zoom ratio is "<zoomInValue>"% on Teacher App
        Examples:
            | click | zoomInValue |
            | 1     | 150         |
            | 2     | 200         |
            | 3     | 300         |
            | 4     | 400         |

    Scenario Outline: Teacher can zoom out sharing pdf
        Given "teacher T1" has shared lesson's "pdf" on Teacher App
        And "teacher T1, teacher T2" have selected zoom tool on Teacher App
        And "teacher T1" has zoomed in "4" time on Teacher App
        When "teacher T2" zooms out "<zoomOutClick>" time on Teacher App
        Then "teacher T1, teacher T2" see sharing pdf with zoom ratio is "<zoomOutValue>"% on Teacher App
        Examples:
            | zoomOutClick | zoomOutValue |
            | 1            | 300          |
            | 2            | 200          |
            | 3            | 150          |
            | 4            | 100          |
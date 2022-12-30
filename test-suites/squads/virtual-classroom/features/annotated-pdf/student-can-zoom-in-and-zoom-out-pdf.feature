@cms @learner
@virtual-classroom
@virtual-classroom-annotated-pdf

Feature: Student can zoom in and zoom out pdf by controller
    Background:
        Given "school admin" logins CMS
        And "student" with course and enrolled status has logged Learner App

    Scenario Outline: Student can zoom in pdf
        Given school admin has created a "past" lesson of lesson management with attached "pdf" on CMS
        And "student" has gone to lesson tab on Learner App
        And "student" has gone to materials page on Learner App
        And "student" has previewed annotated "pdf" on Learner App
        When "student" zooms in "<click>" time on Learner App
        Then "student" sees current zoom in "<zoomInValue>" in zoom controller bar on Learner App
        Examples:
            | click | zoomInValue |
            | 1     | 150         |
            | 2     | 200         |
            | 3     | 300         |
            | 4     | 400         |

    Scenario Outline: Student can zoom out pdf
        Given school admin has created a "past" lesson of lesson management with attached "pdf" on CMS
        And "student" has gone to lesson tab on Learner App
        And "student" has gone to materials page on Learner App
        And "student" has previewed annotated "pdf" on Learner App
        And "student" has zoomed in "4" time on Learner App
        When "student" zooms out "<click>" time on Learner App
        Then "student" sees current zoom in "<zoomOutValue>" in zoom controller bar on Learner App
        Examples:
            | click | zoomOutValue |
            | 1     | 300          |
            | 2     | 200          |
            | 3     | 150          |
            | 4     | 100          |
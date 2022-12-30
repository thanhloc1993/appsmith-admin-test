@cms @teacher @learner
@virtual-classroom
@virtual-classroom-white-board

Feature: Teacher can not allow student to annotate when teacher does not share pdf
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached "pdf, video" on CMS
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario: Teacher can not allow student to annotate when teacher does not share any material
        When "teacher" does not share any material on Teacher App
        Then "teacher" does not see annotate icon in student list on Teacher App
        And "student" does not see annotate icon on Learner App
        And "student" does not see white board bar on Learner App

    Scenario: Teacher can not allow student to annotate when teacher shares video
        When "teacher" shares lesson's "video" under gallery view on Teacher App
        Then "teacher" does not see annotate icon in student list on Teacher App

    Scenario: Teacher can not allow student to annotate after stop sharing pdf
        Given "teacher" has shared lesson's "pdf" under gallery view on Teacher App
        And "teacher" has enabled white board of "student" on Teacher App
        When "teacher" stops sharing pdf on Teacher App
        Then "teacher" does not see annotate icon in student list on Teacher App

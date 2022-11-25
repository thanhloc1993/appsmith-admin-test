@cms @teacher @learner
@virtual-classroom
@virtual-classroom-white-board

Feature: White board bar will be kept or removed when teacher changes material
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached "pdf 1, pdf 2, video" on CMS
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App
        And "teacher" has shared lesson's "pdf 1" on Teacher App

    Scenario: White board bar of student is still kept when teacher changes current sharing pdf to new pdf
        Given "teacher" has enabled white board of "student" on Teacher App
        When "teacher" shares lesson's "pdf 2" on Teacher App
        Then "teacher" still sees "active" "student" annotate icon in student list on Teacher App
        And "student" still sees white board bar on Learner App
        And "student" still sees annotate icon on Learner App

    Scenario: White board bar of student is removed when teacher changes current sharing pdf to video
        Given "teacher" has enabled white board of "student" on Teacher App
        When "teacher" shares lesson's "video" on Teacher App
        Then "teacher" does not see "student" annotate icon in student list on Teacher App
        And "student" does not see white board bar on Learner App
        And "student" does not see annotate icon on Learner App

    Scenario: White board bar of student is removed when teacher shares again the previous pdf
        Given "teacher" has enabled white board of "student" on Teacher App
        And "teacher" has shared lesson's "video" on Teacher App
        When "teacher" shares again lesson's "pdf 1" on Teacher App
        Then "teacher" sees "inactive" "student" annotate icon in student list on Teacher App
        And "student" does not see white board bar on Learner App
        And "student" does not see annotate icon on Learner App

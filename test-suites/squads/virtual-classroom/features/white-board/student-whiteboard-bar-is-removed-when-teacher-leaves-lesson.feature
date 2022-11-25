@cms @teacher @learner
@virtual-classroom
@virtual-classroom-white-board

Feature: White board bar will be removed when teacher leaves lesson or disconnects
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached "pdf" on CMS
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App
        And "teacher" has shared pdf on Teacher App

    Scenario: White board bar of student is removed when teacher leaves lesson
        Given "teacher" has enabled white board of "student" on Teacher App
        When "teacher" leaves lesson on Teacher App
        Then "student" does not see white board bar on Learner App
        And "student" does not see annotate icon on Learner App
        And "student" still sees pdf on Learner App
        And "teacher" rejoins lesson on Teacher App
        And "teacher" sees "active" "student" annotate icon in student list on Teacher App

    Scenario: White board bar of student is removed when teacher disconnects
        Given "teacher" has enabled white board of "student" on Teacher App
        When "teacher" disconnects on Teacher App
        Then "student" does not see white board bar on Learner App
        And "student" does not see annotate icon on Learner App
        And "student" still sees pdf on Learner App
        And "teacher" reconnects on Teacher App
        And "teacher" sees "active" "student" annotate icon in student list on Teacher App

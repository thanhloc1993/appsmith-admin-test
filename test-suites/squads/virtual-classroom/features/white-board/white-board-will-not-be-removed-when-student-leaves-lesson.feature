@cms @teacher @learner
@virtual-classroom
@virtual-classroom-white-board

Feature: White board bar will not be removed when student leaves lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached "pdf" on CMS
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App
        And "teacher" has shared pdf on Teacher App

    Scenario: White board bar is not removed when student leaves lesson
        Given "teacher" has enabled white board of "student" on Teacher App
        When "student" leaves lesson on Learner App
        And "student" rejoins lesson on Learner App
        Then "student" still sees white board bar on Learner App
        And "student" sees annotate icon on Learner App
        And "teacher" sees "active" "student" annotate icon in student list on Teacher App

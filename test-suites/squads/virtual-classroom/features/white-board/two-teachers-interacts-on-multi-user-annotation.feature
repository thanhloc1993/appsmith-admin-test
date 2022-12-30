@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-white-board

Feature: White board bar will not be removed when one of teachers leaves lesson or disconnects
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached "pdf" on CMS
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App
        And "teacher T1" has shared pdf on Teacher App

    Scenario Outline: White board bar of student is not removed when one of teachers leaves lesson
        Given "<user1>" has enabled white board of "student" on Teacher App
        When "<user1>" leaves lesson on Teacher App
        Then "student" still sees white board bar on Learner App
        And "student" still sees annotate icon on Learner App
        And "<user2>" still sees "active" "student" annotate icon in student list on Teacher App
        Examples:
            | user1      | user2      |
            | teacher T1 | teacher T2 |
            | teacher T2 | teacher T1 |

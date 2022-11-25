@cms @teacher @learner
@virtual-classroom
@virtual-classroom-share-material

Feature: Sharing pdf when teacher leaves lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached "pdf" on CMS
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App
        And "teacher" has shared lesson's "pdf" on Teacher App

    Scenario: Sharing pdf is still displayed when teacher leaves lesson
        When "teacher" leaves lesson on Teacher App
        And "student" leaves lesson on Learner App
        And "teacher" rejoins lesson on Teacher App
        And "student" rejoins lesson on Learner App
        Then "teacher" sees lesson's pdf on Teacher App
        And "teacher" sees "active" share material icon on Teacher App
        And "student" sees pdf on Learner App

    Scenario: Sharing pdf is not displayed when teacher ends lesson for all
        When "student" leaves lesson on Learner App
        And "teacher" ends lesson for all on Teacher App
        And "teacher" rejoins lesson on Teacher App
        And "student" rejoins lesson on Learner App
        Then "teacher" does not see lesson's pdf "pdf" on Teacher App
        And "student" does not see pdf on Learner App

@cms @teacher @learner
@virtual-classroom
@virtual-classroom-share-screen

Feature: Teacher cannot enable whiteboard permission of student when teacher is sharing their screen
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached "pdf, video" on CMS
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario: Teacher cannot see annotate icon in student list when teacher is sharing their screen
        Given "teacher" has shared lesson's "pdf" on Teacher App
        And "teacher" has shared their entire screen on Teacher App
        When "teacher" opens student list on Teacher App
        Then "teacher" does not see "student" annotate icon in student list on Teacher App
        #2 positions: Annotate icon beside mute all and annotate icon beside student name
        And "teacher" sees lesson's "pdf" on Teacher App
        And "teacher" sees "active" share material icon on Teacher App
        And "teacher" sees "active" share screen icon on Teacher App
        And "student" sees screen which has been shared on Learner App

    Scenario: Student's whiteboard permission is removed when teacher is sharing their screen
        Given "teacher" has shared lesson's "pdf" on Teacher App
        And "teacher" has enabled white board of "student" on Teacher App
        And "teacher" has shared their entire screen on Teacher App
        When "teacher" opens student list on Teacher App
        Then "teacher" does not see "student" annotate icon in student list on Teacher App
        And "teacher" sees lesson's "pdf" on Teacher App
        And "student" does not see annotate icon on Learner App
        And "student" sees screen which has been shared on Learner App

    Scenario: Teacher cannot enable whiteboard of student when teacher is sharing their screen
        Given "teacher" has shared their entire screen on Teacher App
        And "teacher" has shared lesson's "pdf" on Teacher App
        When "teacher" opens student list on Teacher App
        Then "teacher" does not see "student" annotate icon in student list on Teacher App
        And "teacher" sees lesson's "pdf" on Teacher App
        And "teacher" sees "active" share material icon on Teacher App
        And "teacher" sees "active" share screen icon on Teacher App
        And "student" sees screen which has been shared on Learner App

    Scenario: Teacher can share video before teacher shares their screen
        Given "teacher" has shared lesson's "video" on Teacher App
        When "teacher" shares their entire screen on Teacher App
        Then "teacher" sees "active" share material icon on Teacher App
        And "teacher" sees "active" share screen icon on Teacher App
        And "teacher" still sees lesson's "video" on Teacher App
        And "student" sees screen which has been shared on Learner App

    Scenario: Teacher can share video after teacher shares their screen
        Given "teacher" has shared their entire screen on Teacher App
        When "teacher" shares lesson's "video" on Teacher App
        Then "teacher" sees "active" share material icon on Teacher App
        And "teacher" sees "active" share screen icon on Teacher App
        And "teacher" still sees lesson's "video" on Teacher App
        And "student" sees screen which has been shared on Learner App

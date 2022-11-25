@cms @teacher @learner
@virtual-classroom
@virtual-classroom-white-board

Feature: Student can interact with white board after submitting polling answer
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached "pdf" on CMS
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App
        And "teacher" has shared pdf on Teacher App
        And "teacher" has started polling with correct option is "A" on Teacher App
        And "teacher" has enabled white board of "student" on Teacher App

    Scenario: Student can open white board bar when not submitting polling answer yet
        Given "student" has hidden white board bar by "X button in white board bar" on Learner App
        When "student" selects "A" option in polling answer bar on Learner App
        #student does not submit answer yet
        And "student" hides polling on Learner App
        And "student" shows again white board bar on Learner App
        Then "student" sees white board bar on Learner App
        And "student" still sees white board icon on Learner App
        And "teacher" sees "active" "student" annotate icon in student list on Teacher App

    Scenario: Student can open white board bar after submitting polling answer
        Given "student" has hidden white board bar by "X button in white board bar" on Learner App
        When "student" submits "A" option on Learner App
        And "student" hides polling on Learner App
        And "student" shows again white board bar on Learner App
        Then "student" sees white board bar on Learner App
        And "student" still sees white board icon on Learner App
        And "teacher" sees "active" "student" annotate icon in student list on Teacher App

    Scenario: Student can open white board bar after hiding polling answer bar
        Given "student" has hidden white board bar by "X button in white board bar" on Learner App
        When "student" hides polling on Learner App
        And "student" shows again white board bar on Learner App
        Then "student" sees white board bar on Learner App
        And "student" still sees white board icon on Learner App
        And "teacher" sees "active" "student" annotate icon in student list on Teacher App

    Scenario Outline: Student can interact with whiteboard after submitting polling answer
        Given "student" has hidden white board bar by "X button in white board bar" on Learner App
        When "student" submits "A" option on Learner App
        And "student" hides polling on Learner App
        And "student" shows again white board bar on Learner App
        And "student" selects "<tool>" in white board bar on Learner App
        Then "student" sees respective "<icon>" in white board bar on Learner App
        And "student" still sees white board icon on Learner App
        And "teacher" sees "active" "student" annotate icon in student list on Teacher App
        Examples:
            | tool          | icon            |
            | selector      | cursor          |
            | laser pointer | highlight point |
            | text          | T               |
            | pencil        | pen             |
            | rectangle     | rectangle       |
            | ellipse       | circle          |
            | straight      | straight        |
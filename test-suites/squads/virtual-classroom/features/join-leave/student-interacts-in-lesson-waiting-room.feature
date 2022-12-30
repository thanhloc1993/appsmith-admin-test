@cms @teacher @learner
@virtual-classroom
@virtual-classroom-join-leave

Feature: Student can interact when they are in lesson waiting room
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
        And "teacher" has applied center location in location settings on Teacher App

    Scenario: Student can leave the room when they are in lesson waiting room
        Given "student" has joined lesson's waiting room on Learner App
        When "student" leaves lesson while in waiting room on Learner App
        Then "student" backs to lesson list on Learner App

    # Currently we block back button
    # Scenario: Student can go back to lesson list when they are in lesson waiting room
    #     Given "student" has joined lesson on Learner App
    #     When "student" goes back to lesson list on Learner App
    #     #click back button beside refresh button
    #     Then "student" backs to lesson list on Learner App

    Scenario: Student can refresh their browser when they are in lesson waiting room
        Given "student" has joined lesson's waiting room on Learner App
        When "student" refreshes their browser on Learner App
        Then "student" backs to lesson list on Learner App

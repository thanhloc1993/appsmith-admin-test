@cms @teacher @learner
@virtual-classroom
@virtual-classroom-join-leave

Feature: Teacher can interact in lesson waiting room
    Background:
        Given "school admin" logins CMS
        And "teacher" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
        And "teacher" has applied center location in location settings on Teacher App

    Scenario: Teacher can leave the room when they are in lesson waiting room
        Given "teacher" has gone to lesson waiting room on Teacher App
        When "teacher" leaves lesson on Teacher App
        Then "teacher" backs to lesson detail screen on Teacher App

    #Currently we block back button
    # Scenario: Teacher can go back to lesson detail screen when they are in lesson waiting room
    #     Given "teacher" has gone to lesson waiting room on Teacher App
    #     When "teacher" goes back to lesson detail screen on Teacher App
    #     #back button besides refresh browser
    #     Then "teacher" backs to lesson detail screen on Teacher App

    Scenario: Teacher can refresh their browser when they are in lesson waiting room
        Given "teacher" has gone to lesson waiting room on Teacher App
        When "teacher" refreshes their browser on Teacher App
        Then "teacher" backs to lesson detail screen on Teacher App

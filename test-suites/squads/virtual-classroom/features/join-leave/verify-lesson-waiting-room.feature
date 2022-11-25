@cms @teacher @learner
@virtual-classroom
@virtual-classroom-join-leave

Feature: Verify lesson waiting room
    Background:
        Given "school admin" logins CMS
        And "student" with course and enrolled status has logged Learner App
        And "teacher" logins Teacher App
        And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
        And "teacher" has applied center location in location settings on Teacher App

    Scenario: Lesson waiting room is applied on Teacher App and Learner App when there is no teacher in lesson
        When "student" goes to lesson waiting room on Learner App
        And "teacher" goes to lesson waiting room on Teacher App
        Then "student" sees waiting room icon on Learner App
        And "student" can only leave lesson on Learner App
        And "teacher" sees waiting room banner on Teacher App
        And "teacher" can not interact on Teacher App

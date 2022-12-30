@cms @teacher @learner
@virtual-classroom
@virtual-classroom-join-leave

Feature: Rejoin a live lesson

    Background:
        Given "school admin" logins CMS
        And "student" with course and enrolled status has logged Learner App
        And "teacher" logins Teacher App
        And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario: Teacher can rejoin a lesson after leaving lesson
        Given "teacher" has left lesson on Teacher App
        When "teacher" rejoins lesson on Teacher App
        Then "teacher" sees student in gallery view on Teacher App
        And "teacher" sees "inactive" speaker icon on Teacher App
        And "teacher" sees "inactive" camera icon on Teacher App

    Scenario: Student can rejoin a lesson after leaving lesson
        Given "student" has left lesson on Learner App
        When "student" rejoins lesson on Learner App
        Then "student" sees teacher in gallery view on Learner App
        And "student" sees "inactive" speaker icon on Learner App
        And "student" sees "inactive" camera icon on Learner App

    Scenario: All participants can rejoin a lesson after teacher ends lesson for all
        Given "teacher" has ended lesson for all on Teacher App
        When "teacher" rejoins lesson on Teacher App
        And "student" rejoins lesson on Learner App after Teacher ends lesson for all
        Then "teacher" sees all participant in gallery view on Teacher App
        And "teacher" sees "inactive" speaker and camera icon on Teacher App
        And "student" sees teacher in gallery view on Learner App
        And "student" sees "inactive" speaker and camera icon on Learner App
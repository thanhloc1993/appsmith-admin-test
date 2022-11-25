@cms @teacher @learner
@virtual-classroom
@virtual-classroom-polling-join-and-leave

Feature: Student still can see current polling when student or teacher leaves lesson then rejoin
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson management with start date&time is more than 10 minutes from now
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario: Student can see current polling when teacher leaves lesson
        Given "teacher" has opened polling on Teacher App
        And "teacher" has set correct answer is "A" option
        And "teacher" has started polling on Teacher App
        When "teacher" leaves lesson on Teacher App
        Then "student" sees message Teacher has left the class on Learner App
        And "student" still sees answer bar on Learner App
        And "student" still sees "active" polling icon on Learner App

    Scenario: Teacher can see current polling when they leave lesson then rejoin
        Given "teacher" has opened polling on Teacher App
        And "teacher" has set correct answer is "A" option
        And "teacher" has started polling on Teacher App
        And "teacher" has left lesson on Teacher App
        When "teacher" rejoins lesson on Teacher App
        Then "teacher" sees Stats page on Teacher App
        And "teacher" still sees "active" polling icon on Teacher App

    Scenario: Student can see current polling when they leave lesson then rejoin
        Given "teacher" has opened polling on Teacher App
        And "teacher" has set correct answer is "A" option
        And "teacher" has started polling on Teacher App
        And "student" has hidden polling on Learner App
        And "student" has left lesson on Learner App
        When "student" rejoins lesson on Learner App
        Then "student" still sees answer bar on Learner App
        And "student" still sees "active" polling icon on Learner App

    Scenario: Student and teacher cannot see the previous polling after teacher ends lesson for all
        Given "teacher" has opened polling on Teacher App
        And "teacher" has set correct answer is "A" option
        And "teacher" has started polling on Teacher App
        When "teacher" ends lesson for all on Teacher App
        And "teacher" rejoins lesson on Teacher App
        And "student" rejoins lesson on Learner App after Teacher ends lesson and polling for all
        Then "teacher" does not see Stats page on Teacher App
        And "teacher" sees "inactive" polling icon on Teacher App
        And "student" does not see answer bar on Learner App
        And "student" does not see polling icon on Learner App
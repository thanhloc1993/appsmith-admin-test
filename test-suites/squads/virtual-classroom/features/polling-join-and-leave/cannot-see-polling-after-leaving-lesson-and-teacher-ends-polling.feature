@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-polling-join-and-leave

Feature: Other participants cannot see polling after leaving lesson and teacher ends polling
    Background:
        Given "school admin" logins CMS
        And "teacher T1" logins Teacher App
        And "teacher T2" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson management with start date&time is more than 10 minutes from now
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1" has joined lesson of lesson management on Teacher App
        And "teacher T2" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario: Other participants cannot see polling after leaving lesson and teacher ends polling
        Given "teacher T1" has opened polling on Teacher App
        And "teacher T1" has set correct answer is "A" option
        And "teacher T1" has started polling on Teacher App
        When "teacher T2" leaves lesson on Teacher App
        And "student" hides polling on Learner App
        And "student" leaves lesson on Learner App
        And "teacher T1" stops polling on Teacher App
        And "teacher T1" ends polling on Teacher App
        And "teacher T2" rejoins lesson on Teacher App
        And "student" rejoins lesson on Learner App
        Then "teacher T2" is not redirected to current polling page
        And "teacher T2" sees "inactive" polling icon on Teacher App
        And "student" does not see answer bar on Learner App

    Scenario: Other participants cannot see polling after disconnecting and teacher ends polling
        Given "teacher T1" has opened polling on Teacher App
        And "teacher T1" has set correct answer is "A" option
        And "teacher T1" has started polling on Teacher App
        When "teacher T2" disconnects on Teacher App
        And "student" disconnects on Learner App
        And "teacher T1" stops polling on Teacher App
        And "teacher T1" ends polling on Teacher App
        And "teacher T2" reconnects on Teacher App
        And "student" reconnects on Learner App
        Then "teacher T2" does not see Stats page on Teacher App
        And "teacher T2" sees "inactive" polling icon on Teacher App
        And "student" does not see answer bar on Learner App
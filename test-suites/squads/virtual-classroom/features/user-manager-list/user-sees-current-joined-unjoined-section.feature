@cms @teacher @learner @learner2
@virtual-classroom
@virtual-classroom-user-manager-list

Feature: Teacher sees current Joined/ Unjoined section match with student joins/ does not join
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student S1, student S2" with course and enrolled status have logged Learner App
        And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App

    @blocker
    Scenario: Teacher see respective student on joined/ unjoined section when student joined
        Given "student S1" has joined lesson on Learner App
        When "teacher" opens student list on Teacher App
        Then "teacher" "can see" "student S1" in Joined section student list on Teacher App
        And "teacher" "can see" "student S2" in Unjoined section student list on Teacher App

    Scenario: Teacher see respective student on joined/ unjoined section when student joined and leaved
        Given "student S1, student S2" have joined lesson on Learner App
        When "teacher" opens student list on Teacher App
        And "student S1" leaves lesson on Learner App
        Then "teacher" "can see" "student S1" in Unjoined section student list on Teacher App
        And "teacher" "can see" "student S2" in Joined section student list on Teacher App

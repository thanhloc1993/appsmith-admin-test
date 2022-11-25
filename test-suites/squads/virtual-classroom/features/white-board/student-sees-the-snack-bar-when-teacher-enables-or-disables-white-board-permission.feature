@cms @teacher @learner @learner2
@virtual-classroom
@virtual-classroom-white-board

Feature: Student will see the snack bar when teacher enables or disables white board permission
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student S1, student S2" with course and enrolled status have logged Learner App
        And school admin has created a lesson of lesson management with attached "pdf" on CMS
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student S1" has joined lesson on Learner App
        And "teacher" has shared pdf on Teacher App

    Scenario: Student will see the snack bar when teacher enables white board permission
        When "teacher" enables white board bar of "student S1" on Teacher App
        Then "student S1" sees the snack bar for noticing white board permission is granted on Learner App

    Scenario: Student will see the snack bar again when student leaves lesson then rejoining
        Given "teacher" has enabled white board of "student S1" on Teacher App
        When "student S1" leaves lesson on Learner App
        And "student S1" rejoins lesson on Learner App
        Then "student S1" sees the snack bar for noticing white board permission is granted on Learner App
        And "student S1" sees white board bar on Learner App

    Scenario: Student will see the snack bar when teacher disables white board permission
        Given "teacher" has enabled white board of "student S1" on Teacher App
        When "teacher" disables white board bar of "student S1" on Teacher App
        Then "student S1" sees the snack bar for noticing white board permission is removed on Learner App
        And "student S1" does not see white board bar on Learner App

    Scenario: Student joins later will not see the snack bar when teacher enables white board permission of other student
        Given "teacher" has enabled white board of "student S1" on Teacher App
        When "student S2" joins lesson on Learner App
        Then "student S2" does not see the snack bar for noticing white board permission is granted on Learner App
        And "student S2" does not see white board bar on Learner App

    Scenario: Student joins later will see the snack bar when teacher disables white board permission of other student
        Given "teacher" has enabled white board of "student S1" on Teacher App
        When "teacher" disables white board bar of "student S1" on Teacher App
        And "student S2" joins lesson on Learner App
        Then "student S2" does not see the snack bar for noticing white board permission is removed on Learner App
        And "student S2" does not see white board bar on Learner App

    Scenario: Student will see the snack bar when teacher enables for specific student
        Given "student S2" has joined lesson on Learner App
        When "teacher" enables white board bar of "student S1" on Teacher App
        Then "student S1" sees the snack bar for noticing white board permission is granted on Learner App
        And "student S1" sees white board bar on Learner App
        And "student S2" does not see the snack bar for noticing white board permission is granted on Learner App
        And "student S2" does not see white board bar on Learner App

    Scenario: Student will see the snack bar when teacher disables for specific student
        Given "student S2" has joined lesson on Learner App
        And "teacher" has enabled white board of "student S1" on Teacher App
        When "teacher" disables white board bar of "student S1" on Teacher App
        Then "student S1" sees the snack bar for noticing white board permission is removed on Learner App
        And "student S1" does not see white board bar on Learner App
        And "student S2" does not see the snack bar for noticing white board permission is removed on Learner App
        And "student S2" does not see white board bar on Learner App
@cms @teacher @learner @learner2
@virtual-classroom
@virtual-classroom-white-board

Feature: Teacher can enable or disable student's white board bar
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student S1, student S2" with course and enrolled status have logged Learner App
        And school admin has created a lesson of lesson management with attached "pdf" on CMS
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student S1, student S2" have joined lesson on Learner App
        And "teacher" has shared pdf on Teacher App

    # @blocker
    Scenario: Teacher can enable white board bar of individual student
        When "teacher" enables white board bar of "student S1" on Teacher App
        Then "teacher" sees "active" annotation icon on Teacher App
        And "teacher" sees "active" "student S1" annotate icon in student list on Teacher App
        And "teacher" sees "inactive" "student S2" annotate icon in student list on Teacher App
        And "student S1" sees white board bar on Learner App
        And "student S1" sees annotate icon on Learner App
        And "student S2" does not see white board bar on Learner App
        And "student S2" does not see annotate icon on Learner App

    # @blocker
    Scenario: Teacher can disable white board bar of individual student
        Given "teacher" has enabled white board bar of all students on Teacher App
        When "teacher" disables white board bar of "student S1" on Teacher App
        Then "teacher" still sees "active" annotation icon on Teacher App
        And "teacher" sees "inactive" "student S1" annotate icon in student list on Teacher App
        And "teacher" sees "active" "student S2" annotate icon in student list on Teacher App
        And "student S1" does not see white board bar on Learner App
        And "student S1" does not see annotate icon on Learner App
        And "student S2" still sees white board bar on Learner App
        And "student S2" still sees annotate icon on Learner App

    Scenario: Teacher can enable white board bar of all students
        When "teacher" enables white board bar of all students on Teacher App
        Then "teacher" sees "active" annotation icon on Teacher App
        And "teacher" sees "active" "student S1" annotate icon in student list on Teacher App
        And "teacher" sees "active" "student S2" annotate icon in student list on Teacher App
        And "student S1, student S2" see white board bar on Learner App
        And "student S1, student S2" see annotate icon on Learner App

    Scenario: Teacher can disable white board bar of all students
        Given "teacher" has enabled white board bar of all students on Teacher App
        When "teacher" disables white board bar of all students on Teacher App
        Then "teacher" sees "inactive" annotation icon on Teacher App
        And "teacher" sees "inactive" "student S1" annotate icon in student list on Teacher App
        And "teacher" sees "inactive" "student S2" annotate icon in student list on Teacher App
        And "student S1, student S2" do not see white board bar on Learner App
        And "student S1, student S2" do not see annotate icon on Learner App
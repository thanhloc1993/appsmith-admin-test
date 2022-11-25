@cms @learner @teacher @learner2
@user @grpc @ignore @student-info

Feature: Create student by gRPC

    Scenario: Create student by gRPC then log in the Learner App
        Given "school admin" logins CMS
        And school admin creates student with student info and parent info
        Then student logins Learner App successfully with credentials by gRPC

    ### Check [AccountRoles] define for the actor "student" or "student S1"
    ### Profile is saved to context with key `learnerProfileAlias-student`
    ### Remember to run the driver corresponding with the actor
    ### For example:
    ###     for the actor "student S2", we should has tag @learner2 on the feature BDD, and make sure the driver with vm `learner_2` are running
    ### See Makefile: run-learner-web, run-parent-web for more understanding

    Scenario: Create student "student" and "student S2" by gRPC then log in the Learner App
        Given "school admin" logins CMS
        And school admin has created a student "student" with "1 parents", "0 visible courses"
        And school admin has created a student "student S2" with "0 parents", "1 visible courses"
        Then "student" logins Learner App
        And "student S2" logins Learner App
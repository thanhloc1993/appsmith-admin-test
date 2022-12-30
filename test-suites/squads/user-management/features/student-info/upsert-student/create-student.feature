@cms @teacher @learner @learner2 @parent @user @student-info @parent-info
Feature: Create Student on CMS

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App

    #@blocker
    Scenario: Create student with only student info
        When school admin creates a new student with student info
        Then school admin sees newly created student on CMS
        And student logins Learner App successfully with credentials which school admin gives

    Scenario: Create student with new parent
        When school admin creates a new student with parent info
        Then school admin sees newly created student on CMS
        And student logins Learner App successfully with credentials which school admin gives
        And new parent logins Learner App successfully with credentials which school admin gives
        And parent sees 1 student's stats on Learner App

    Scenario: Create student with existed parent
        Given school admin has created a "student S1" with parent info
        When school admin creates a new "student S2" with existed parent info
        Then school admin sees newly created "student S2" on CMS
        And student "student S2" logins Learner App successfully with credentials which school admin gives
        And existed parent logins Learner App successfully with his existed credentials
        And parent sees 2 student's stats on Learner App

    @ignore
    Scenario: Create student with parent and associate student with course
        Given school admin has created a student with parent info
        When school admin creates a new student with new parent, existed parent and visible course
        Then school admin sees newly created student on CMS
        And teacher sees newly created student on Teacher App
        And student logins Learner App successfully with credentials which school admin gives
        And student sees the course on Learner App
        And new parent logins Learner App successfully with credentials which school admin gives
        And existed parent logins Learner App successfully with his existed credentials
        And "all parent" sees "all" student's stats on Learner App

    Scenario: Create student without not required fields
        When school admin creates a new student without not required fields
            | not required fields |
            | phoneNumber         |
            | studentExternalId   |
            | studentNote         |
            | birthday            |
            | gender              |
            | firstNamePhonetic   |
            | lastNamePhonetic    |
        Then school admin sees newly created student on CMS
        And student logins Learner App successfully with credentials which school admin gives

    Scenario: Create student with duplicate external student ID
        Given school admin has created a "student S1" with student information
        When school admin creates a new student with external student ID which duplicated with "student S1"
        Then school admin sees newly created student on CMS
        And student logins Learner App successfully with credentials which school admin gives

    @ignore
    Scenario: Can not create student with existed email
        Given school admin has created a "student S1" with student information
        When school admin creates a "student S2" with existed email of the "student S1"
        Then school admin sees the error messages
        And school admin can not create the "student S2"

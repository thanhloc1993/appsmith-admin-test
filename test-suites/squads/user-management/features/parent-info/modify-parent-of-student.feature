@cms @learner @parent
@user @parent-info
Feature: Modify parent of student

    Background:
        Given "school admin" logins CMS
        And school admin has created a "student S1" with "parent P1" info
        And user "student S1" logins Learner App successfully with credentials which school admin gives

    Scenario: Add new parent when editing student
        When school admin adds new "parent P2" for "student S1"
        Then school admin sees "2" parent on parent list of "student S1"
        And user "parent P2" logins Learner App successfully with credentials which school admin gives
        And "parent P2" sees "1" student's stats on Learner App

    Scenario: Add existed parent when editing new created student
        Given school admin has created a "student S2" with student info
        When school admin adds existed "parent P1" for "student S2"
        Then school admin sees "1" parent on parent list of "student S2"
        And user "parent P1" logins Learner App successfully with his existed credentials
        And "parent P1" sees "2" student's stats on Learner App

    Scenario: Edit existed parent when editing student
        When school admin edits "parent P1" info of "student S1"
        Then school admin sees updated parent list on "student S1" detail page
        And "parent P1" cannot login Learner App with his old email and old password
        And "parent P1" logins successfully with his new email and old password
        And "parent P1" sees "1" student's stats on Learner App

    Scenario: Add and edit existed parent when editing student
        Given school admin has created a "student S2" with "parent P2" info
        When school admin adds and edits "parent P2" info of "student S1"
        Then school admin sees updated parent list on "student S1" detail page
        And school admin sees updated parent list on "student S2" detail page
        And "parent P2" cannot login Learner App with his old email and old password
        And "parent P2" logins successfully with his new email and old password
        And "parent P2" sees "2" student's stats on Learner App

    Scenario: Edit existed parent and add new parent when editing student
        When school admin edits email of "parent P1"
        And  school admin adds a new parent for "student S1"
        Then school admin sees updated parent list on "student S1" detail page
        And "parent P1" logins Learner App successfully with his new email and old password
        And new parent logins Learner App successfully with his existed credentials

    Scenario: Remove associated parent when editing student
        Given school admin has created a "student S2" with existed "parent P1" info
        When school admin removes "parent P1" from "student S1"
        Then school admin sees updated parent list on student detail page
        And user "parent P1" logins Learner App successfully with his existed credentials
        And parent does not see "student S1" stats on Learner App

    Scenario: Can not edit new parent info without required field
        When school admin edits only email of "parent P1" to "blank"
        Then school admin sees the error message with "blank"
        And school admin can not update the parent
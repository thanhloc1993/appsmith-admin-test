@cms
@user @parent-info

Feature: Edit parent of student on CMS

    Background:
        Given "school admin" logins CMS
        And school admin has created a "student S1" with "parent P1" info

    Scenario: Keep the old data when admin cancel the edit student
        When school admin cancels the edits info of "parent P1"
        Then school admin sees old data of "student S1"

    Scenario Outline: Edit wrong existed parent email when editing student
        When school admin adds new "parent P2" for "student S1"
        And school admin edits only email of "parent P1" to "<invalidEmail>"
        Then school admin sees the error message with "<invalidEmail>"
        Examples:
            | invalidEmail                          |
            | blank                                 |
            | invalid format                        |
            | current student email                 |
            | existed student email on system       |
            | existed parent out of the parent list |
            | existed parent in the parent list     |

    @ignore
    Scenario: Parent account logs out after 1 hour when admin changes existed parent email
        Given user "parent P1" logins Learner App successfully with his existed credentials
        When school admin edits info of "parent P1"
        Then school admin sees updated parent list on "student S1" detail page
        And "parent P1" logs out after 1 hour
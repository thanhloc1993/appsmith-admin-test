@cms @teacher @learner @parent
@communication
@support-chat
@ignore

Feature: Remove message

    Background:
        Given "school admin" logins CMS
        And "school admin" has created student with parent info
        And "teacher" has joined student and parent chat group
        And "student" logins Learner App successfully with credentials which school admin gives
        And "parent" logins Learner App successfully with credentials which school admin gives

    Scenario Outline: <userAccount> removes text message
        Given "<userAccount>" has sent a text message in "<userAccount>" chat group
        When "<userAccount>" removes that text message
        Then teacher sees text message has been removed
        And "<userAccount>" sees text message has been removed
        Examples:
            | userAccount |
            | student     |
            | parent      |

    Scenario Outline: Teacher removes text message
        Given teacher has sent a text message in "<userAccount>" chat group
        When teacher removes that text message
        Then teacher sees text message has been removed
        And "<userAccount>" sees text message has been removed
        Examples:
            | userAccount |
            | student     |
            | parent      |
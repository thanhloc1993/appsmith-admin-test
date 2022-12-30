@cms @teacher @parent @parent2
@communication
@support-chat @support-chat-join-leave

Feature: Parent leaves conversation

    Background:
        Given "school admin" logins CMS
        And "school admin" has filtered organization on location settings
        And school admin has created a student "student S1" with "2 parents", "0 visible courses"
        And "teacher T1" logins Teacher App
        And "teacher T1" has filtered location in location settings on Teacher App with student locations
        And "parent P1" of "student S1" logins Learner App
        And "parent P2" of "student S1" logins Learner App
        And "teacher T1" is at the conversation screen on Teacher App
        And "teacher T1" joined "student S1" group chat and "parent P1" group chat successfully
        And "teacher T1" has accessed to the conversation of "parent P1" chat group

    Scenario Outline: Parent leaves parent chat group
        Given "parent P1, parent P2" of "student S1" is at the conversation screen on Learner App
        When "parent P1" sends "<messageType>" to the conversation on Learner App
        And school admin remove relationship between "parent P1" and "student S1"
        Then "parent P1" sees parent chat group of "student S1" is removed on Learner App
        And "teacher T1" sees "parent P1" of "student S1" message with name and avatar on Teacher App
        And "parent P2" of "student S1" sees message with "messageType" on Learner App
        Examples:
            | messageType             |
            | 1 of [text, image, pdf] |

    Scenario Outline: Parent leaves and rejoins parent chat group
        Given "parent P1, parent P2" of "student S1" is at the conversation screen on Learner App
        When school admin remove relationship between "parent P1" and "student S1"
        And school admin adds "parent P1" for "student S1"
        And "parent P1" sees parent chat group of "student S1" is removed on Learner App
        And "parent P1" of "student S1" can access the conversation after reload conversation list on Learner App
        And "parent P1" sends "<messageType>" to the conversation on Learner App
        Then "teacher T1" sees "parent P1" of "student S1" message with name and avatar on Teacher App
        And "parent P2" of "student S1" sees message with "messageType" on Learner App
        Examples:
            | messageType             |
            | 1 of [text, image, pdf] |
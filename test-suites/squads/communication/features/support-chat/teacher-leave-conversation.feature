@cms @teacher @teacher2 @learner @parent
@communication
@support-chat @support-chat-join-leave

Feature: Teacher leave conversation

    Background:
        Given "school admin" logins CMS
        And school admin has created a student "student S1" with "1 parents", "0 visible courses"
        And "teacher T1, teacher T2" login Teacher App
        And "student S1" logins Learner App
        And "parent P1" of "student S1" logins Learner App
        And "teacher T1, teacher T2" has filtered location in location settings on Teacher App with student locations
        And "teacher T1, teacher T2" is at the conversation screen on Teacher App
        And "student S1, parent P1" is at the conversation screen on Learner App
        And "teacher T1" joined "student S1" group chat and "parent P1" group chat successfully
        And "teacher T2" joined "student S1" group chat and "parent P1" group chat successfully

    Scenario Outline: Teacher leave <userAccount> chat group
        Given "teacher T1" has accessed to the conversation of "<userAccount>" chat group
        And "teacher T2" has accessed to the conversation of "<userAccount>" chat group
        When teacher sends "<messageType>" to the conversation on Teacher App
        And "teacher T1" leaves "<userAccount>" chat group
        Then teacher sees teacher leave "<userAccount>" chat group successfully
        And "<userAccount>" of "student S1" sees message with "messageType" on Learner App
        And "teacher T2" sees message of "teacher T1" with name and avatar on Teacher App
        Examples:
            | userAccount | messageType             |
            | student S1  | 1 of [text, image, pdf] |
            | parent P1   | 1 of [text, image, pdf] |

    Scenario Outline: Teacher leave and rejoin <userAccount> chat group
        Given "teacher" leaves "<userAccount>" chat group
        And "teacher" joins "<userAccount>" chat group
        And "teacher T1" has accessed to the conversation of "<userAccount>" chat group
        And "teacher T2" has accessed to the conversation of "<userAccount>" chat group
        When teacher sends "<messageType>" to the conversation on Teacher App
        Then "<userAccount>" of "student S1" sees message with "messageType" on Learner App
        And "teacher T2" sees message of "teacher T1" with name and avatar on Teacher App
        Examples:
            | userAccount | messageType             |
            | student S1  | 1 of [text, image, pdf] |
            | parent P1   | 1 of [text, image, pdf] |

@cms @teacher @learner @parent
@communication
@support-chat
@ignore

Feature: View message history

    Background:
        Given "school admin" logins CMS
        And "school admin" has created student S1 with parent P1, P2 info
        And "student S1" logins Learner App
        And "parent P1", "parent P2" logins Learner App
        And "teacher T1" logins Teacher App
        And "teacher T1" has joined student S1, parent P1 chat groups

    Scenario Outline: New teacher sees message history in <userType> chat group
        Given "<userAccount>" has sent "<messageType>" message in "<userType>" chat group
        And "teacher T1" has sent "<messageType>" message in "<userType>" chat group
        When "teacher T2" joins "<userType>" chat group
        Then "teacher T2" sees sent message from "teacher T1"
        And "teacher T2" sees sent message from "<userAccount>"
        Examples:
            | userType | userAccount             | messageType             |
            | student  | student S1              | 1 of [text, image, pdf] |
            | parent   | parent P1 and parent P2 | 1 of [text, image, pdf] |

    Scenario Outline: <newParent> sees message history in parent chat group
        Given "teacher T1" has sent "<messageType>" in parent chat group
        And "parent P1" has sent "<messageType>" in parent chat group
        And "parent P2" has sent "<messageType>" in parent chat group
        When school admin adds "<newParent>" for student S1
        And "<newParent>" joins parent chat group
        Then "<newParent>" sees sent message from "teacher T1"
        And "<newParent>" sees sent message from "parent P1"
        And "<newParent>" sees sent message from "parent P2"
        Examples:
            | newParent           | messageType             |
            | newly create parent | 1 of [text, image, pdf] |
            | an existed parent   | 1 of [text, image, pdf] |
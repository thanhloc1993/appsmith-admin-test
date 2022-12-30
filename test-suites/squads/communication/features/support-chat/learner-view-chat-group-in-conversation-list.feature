@cms @teacher @learner @parent
@communication
@support-chat
@ignore

Feature: Learner views chat group information in conversation list

    Background:
        Given "school admin" logins CMS
        And "school admin" has created student S1 with parent P1 info
        And "school admin" has created student S2 with parent P1 info
        And "student S1" logins Learner App
        And "parent P1" logins Learner App
        And "teacher T1" logins Teacher App
        And "teacher T1" has joined student S1, parent P1 chat groups
        And "student S1", "parent P1" is at conversation list

    Scenario Outline: <messageDescription> displays at <userAccount> chat group's thread in conversation list
        When "teacher" sends "<messageType>" message to "<userAccount>" chat group
        Then "<userAccount>" sees "<messageDescription>" under chat group name
        Examples:
            | messageType | userAccount               | messageDescription                |
            | text        | 1 of [student, parent P1] | text message                      |
            | image       | 1 of [student, parent P1] | Teacher T1 has sent an attachment |
            | pdf         | 1 of [student, parent P1] | Teacher T1 has sent an attachment |

    Scenario Outline: Chat group which has newest message is displayed on top of all conversation lists
        When "teacher" has sent "<messageType>" message in student S1's parent P1 chat group
        And "teacher" has sent "<messageType>" message in student S2's parent P1 chat group
        Then parent P1 sees student S2's parent P1 chat group is on top in conversation lists
        Examples:
            | messageType             |
            | 1 of [text, image, pdf] |
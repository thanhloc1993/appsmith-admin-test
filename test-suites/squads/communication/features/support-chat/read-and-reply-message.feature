@cms @teacher @learner @parent
@communication
@support-chat

Feature: Read and reply message

    Background:
        Given "school admin" logins CMS
        And school admin has created a student "student" with "1 parents", "0 visible courses"
        And "teacher" logins Teacher App
        And "teacher" has filtered location in location settings on Teacher App with student locations
        And "student" logins Learner App
        And "parent P1" of "student" logins Learner App
        And teacher has joined conversation with created student and parent

    # Scenario Outline: Teacher sees status that <userAccount> does not read the message in Teacher App
    #     Given teacher sends "<messageType>" message to "<userAccount>"
    #     # When "<userAccount>" does not read message
    #     Then teacher does not see "Read" status next to message in conversation on Teacher App
    #     And teacher sees "Replied" icon next to chat group in Message list on Teacher App
    #     # And "<userAccount>" sees chat group with unread message is showed on top on Learner App
    #     And "<userAccount>" sees "Unread" icon next to chat group in Messages list on Learner App
    #     Examples:
    #         | messageType             | userAccount |
    #         | 1 of [text, image, pdf] | student     |

    Scenario Outline: Teacher sees status that <userAccount> read the message in Teacher App
        Given teacher sends "<messageType>" message to "<userAccount>"
        When "<userAccount>" reads the message
        Then teacher sees "Read" status next to message on Teacher App
        And teacher sees "Replied" icon next to chat group in Messages list on Teacher App
        And "<userAccount>" sees "Unread" icon next to chat group disappeared in Messages list on Learner App
        Examples:
            | messageType             | userAccount |
            | 1 of [text, image, pdf] | student     |
            | 1 of [text, image, pdf] | parent P1   |

    Scenario Outline: Teacher does not reads reply from <userAccount>
        Given teacher selects "<userAccount>" chat group
        And "<otherUserAccount>" sends "<messageType>" message to teacher
        Then teacher does not see "Replied" icon next to "<otherUserAccount>" chat group in Messages list on Teacher App
        And teacher sees "Unread" icon next to "<otherUserAccount>" chat group in Messages list on Teacher App
        And teacher sees chat group with unread message shown on top in Messages list on Teacher App
        And "<userAccount>" does not see "Read" status next to message on Learner App
        Examples:
            | messageType             | userAccount | otherUserAccount |
            | 1 of [text, image, pdf] | student     | parent P1        |
            | 1 of [text, image, pdf] | parent P1   | student          |

    Scenario Outline: Teacher reads reply from <userAccount>
        Given teacher sends "<messageType>" message to "<userAccount>"
        And "<userAccount>" replies to teacher
        When teacher read replies
        Then teacher does not see "Replied" icon next to "<userAccount>" chat group in Messages list on Teacher App
        And teacher sees "Unread" icon next to "<userAccount>" chat group disappeared in Messages list on Teacher App
        And "<userAccount>" does not sees "Read" status next to message on Learner App
        Examples:
            | messageType             | userAccount |
            | 1 of [text, image, pdf] | student     |
            | 1 of [text, image, pdf] | parent P1   |
@cms @teacher @learner @parent
@communication
@support-chat

Feature: Send and receive message

    Background:
        Given "school admin" logins CMS
        And school admin has created a student "student" with "1 parents", "0 visible courses"
        And "teacher" logins Teacher App
        And "teacher" has filtered location in location settings on Teacher App with student locations
        And "student" logins Learner App
        And "parent P1" of "student" logins Learner App
        And "student, parent P1" is at the conversation screen on Learner App
        And teacher has joined conversation with created student and parent

    Scenario Outline: Teacher sends <messageType> message to <userAccount> chat group on Teacher App
        Given "teacher" has accessed to the conversation of "<userAccount>" chat group
        When teacher sends "<messageType>" to the conversation on Teacher App
        Then "messageType" is sent
        And teacher sees "messageType" on Teacher App
        And "<userAccount>" of "student" sees message with "messageType" on Learner App
        Examples:
            | userAccount | messageType                             |
            | student     | 1 of [text, image, pdf, hyperlink, zip] |
            | parent P1   | 1 of [text, image, pdf, hyperlink, zip] |

    Scenario Outline: <userAccount> sends <messageType> message to teacher on Learner App
        Given "teacher" has accessed to the conversation of "<userAccount>" chat group
        When "<userAccount>" sends "<messageType>" to the conversation on Learner App
        Then "<userAccount>" of "student" sees message with "messageType" on Learner App
        And teacher sees "messageType" on Teacher App
        Examples:
            | userAccount | messageType                             |
            | student     | 1 of [text, image, pdf, hyperlink, zip] |
            | parent P1   | 1 of [text, image, pdf, hyperlink, zip] |

    # @ignore
    # Scenario Outline: <userAccount> take a picture via camera and send to teacher on Learner App
    #     Given teacher has accessed to the conversation of "<userAccount>" chat group
    #     When "<userAccount>" takes a picture via camera of their device
    #     And "<userAccount>" sends picture just taken
    #     Then "<userAccount>" sees taken picture on Learner App
    #     And teacher sees taken picture on Teacher App
    #     Examples:
    #         | userAccount |
    #         | student     |
    #         | parent P1      |

    # @ignore
    # Scenario Outline: <userAccount> open hyperlink in conversation screen of chat group
    #     Given teacher has accessed to the conversation of "<userAccount>" chat group
    #     And teacher has sent hyperlink in the conversation
    #     When "<member>" interacts with hyperlink
    #     Then "<member>" redirects to web browser
    #     Examples:
    #         | userAccount | member                  |
    #         | student     | 1 of [student, teacher] |
    #         | parent P1      | 1 of [parent, teacher]  |

    # @ignore
    # Scenario Outline: <member> open hyperlink in pdf file of <userAccount> chat group
    #     Given teacher has accessed to the conversation of "<userAccount>" chat group
    #     And teacher has sent pdf with hyperlink in the content to the conversation
    #     When "<member>" views the detail of pdf file
    #     And "<member>" interacts with hyperlink
    #     Then "<member>" redirects to web browser
    #     Examples:
    #         | userAccount | member                  |
    #         | student     | 1 of [student, teacher] |
    #         | parent P1      | 1 of [parent, teacher]  |

    Scenario Outline: <userAccount> opens <messageType> message
        Given "teacher" has accessed to the conversation of "<userAccount>" chat group
        And teacher has sent "<messageType>" message to "<userAccount>" chat group
        When "<userAccount>" interacts "messageType" message
        Then "<userAccount>" sees "messageType" display in detail
        Examples:
            | userAccount | messageType       |
            | student     | 1 of [image, pdf] |
            | parent P1   | 1 of [image, pdf] |

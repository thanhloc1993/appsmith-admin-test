@cms @teacher @learner @parent
@communication
@support-chat
@ignore

Feature: Receive chat notification

    Background:
        Given "school admin" logins CMS
        And school admin has created "student" with grade and "parent P1" info
        And "teacher" logins Teacher App
        And "student" logins Learner App successfully with credentials which school admin gives
        And "parent" logins Learner App successfully with credentials which school admin gives
        And "teacher" has joined conversation with created student and parent

    Scenario Outline: Notify for teacher when receive new <messageType> message from <userAccount>
        Given "teacher" is not at "<userAccount>" chat group
        When "<userAccount>" sends new "<messageType>" message to teacher on Learner App
        Then "teacher" sees new message notification on Teacher App
        Examples:
            | userAccount | messageType             |
            | student     | 1 of [text, image, pdf] |
            | parent      | 1 of [text, image, pdf] |

    Scenario Outline: <userAccount> receives new <messageType> message notification when application status is <applicationStatus>
        Given application status is "<applicationStatus>"
        When "teacher" sends "<messageType>" message to "<userAccount>" chat group
        And "<userAccount>" interacts with the "<messageType>" message notification
        Then "<userAccount>" redirects to message list on Learner App
        Examples:
            | applicationStatus                    | messageType             | userAccount |
            | user is interacting with Learner App | 1 of [text, image, pdf] | student     |
            | user is interacting with Learner App | 1 of [text, image, pdf] | parent      |
    # | user sends app to background         | 1 of [text, image, pdf] | student     |
    # | user sends app to background         | 1 of [text, image, pdf] | parent      |
    # | user kills app                       | 1 of [text, image, pdf] | student     |
    # | user kills app                       | 1 of [text, image, pdf] | parent      |

    Scenario Outline: <userAccount> does not receive new <messageType> message notification when they logout Learner App
        Given "<userAccount>" logout Learner App
        When teacher sends new "<messageType>" message to "<userAccount>" chat group
        Then "<userAccount>" does not receive new message notification
        Examples:
            | userAccount | messageType             |
            | student     | 1 of [text, image, pdf] |
            | parent      | 1 of [text, image, pdf] |

    Scenario Outline: <userAccount> does not receive new <messageType> message notification in their device when they re-login Learner App
        Given "<userAccount>" logout Learner App
        And teacher sends new "<messageType>" message to "<userAccount>" chat group
        When "<userAccount>" logins Learner App
        Then "<userAccount>" does not receive new message notification in their device
        And "<userAccount>" sees new message notification on Learner App
        Examples:
            | userAccount | messageType             |
            | student     | 1 of [text, image, pdf] |
            | parent      | 1 of [text, image, pdf] |
@cms @learner @parent
@communication
@compose-notification

Feature: Read notification

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "student" logins Learner App
        And "parent P1" of "student" logins Learner App
        And "school admin" is at "Notification" page on CMS

    Scenario: Student and parent open hyperlink in the content of notification
        Given school admin has created notification that content includes hyperlink
        And school admin has sent notification to student and parent
        When "student" interacts with notification banner
        And "parent P1" interacts with notification banner
        Then "student" sees notification have hyperlink
        And "parent P1" sees notification have hyperlink

    # Scenario Outline: <userAccount> opens hyperlink in the PDF attached on notification
    #     Given school admin has created notification with PDF file
    #     And PDF file has contained a hyperlink
    #     And school admin has sent notification to "<userAccount>"
    #     When "<userAccount>" opens PDF file on Learner App
    #     And "<userAccount>" interacts with the hyperlink in the PDF on Learner App
    #     Then redirects "<userAccount>" to web browser
    #     Examples:
    #         | userAccount |
    #         | student     |
    #         | parent      |

    Scenario Outline: Update read number in <section> list on CMS when <userAccount> read the notification
        Given school admin has sent the notification for student and parent
        # send notification for student and parent only
        When "<userAccount>" reads the notification
        Then school admin sees "<readNumber>" people display in "<section>" notification list on CMS
        Examples:
            | userAccount               | readNumber | section          |
            | 1 of [student, parent P1] | 1/2        | 1 of [All, Sent] |
            | student and parent P1     | 2/2        | 1 of [All, Sent] |

    Scenario Outline: Update read status in notification detail on CMS when <userAccount> read the notification
        Given school admin has sent the notification for student and parent
        # send notification for student and parent only
        When "<userAccount>" reads the notification
        Then school admin sees the status of "<userAccount>" already read the notification
        Examples:
            | userAccount           |
            | student               |
            | parent P1             |
            | student and parent P1 |

@cms
@communication
@compose-notification
@ignore

Feature: Fail to attach file in notification

    Background:
        Given "school admin" logins CMS

    Scenario Outline: Fail to attach <fileType> file in compose notification full-screen dialog
        Given school admin has opened compose notification full-screen dialog
        When school admin uploads "<fileType>" file
        # Check UI cannot upload file
        Then school admin sees error message
        Examples:
            | fileType |
            | image    |
            | video    |

    Scenario Outline: Fail to attach <fileType> file in edited notification full-screen dialog
        Given "school admin" has created a draft notification
        And school admin has opened draft notification full-screen dialog
        When school admin uploads "<fileType>" file
        # Check UI cannot upload file
        Then school admin sees error message
        Examples:
            | fileType |
            | image    |
            | video    |
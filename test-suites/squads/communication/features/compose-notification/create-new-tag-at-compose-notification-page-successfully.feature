@cms
@communication
@compose-notification
@ignore

Feature: Create new tag at compose notification

    Background:
        Given "school admin" logins CMS
        And school admin is at "Notification" page on CMS

    Scenario: New tag add to tag field when create new tag in compose notification screen
        Given "school admin" has opened compose notification full-screen dialog
        When "school admin" input "tag name" that does not exist into "tag field"
        And "school admin" add the new "tag name" to "tag field"
        And "school admin" save new "tag name" at confirm dialog
        Then "school admin" sees message "Working in progress"
        And "school admin" sees new "tag name" added to "tag field"
        And "school admin" sees message "You have created a new Tag successfully"

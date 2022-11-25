@cms @learner
@communication
@compose-notification

Feature: Admin views the notification list

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And notifications list has at least 1 Draft, 1 Sent notification and 1 Scheduled notification
        And "school admin" is at "Notification" page on CMS

    Scenario Outline: List of notification group by <category> category
        When school admin selects "<category>" category on notification menu
        Then school admin sees "<category>" notifications display on CMS order by last modified
        Examples:
            | category  |
            | All       |
            | Draft     |
            | Sent      |
            | Scheduled |

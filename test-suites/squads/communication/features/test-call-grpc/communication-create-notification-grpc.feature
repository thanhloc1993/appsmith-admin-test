@cms @learner
@communication @grpc
@ignore

Feature: Create Notification with GRPC call
    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App

    Scenario: Create Send Notification with GRPC call then show in notification list
        When school admin creates send notification
        Then school admin sees the newly created notification

@demo @ignore @network @cms

Feature: Launch n browsers

    Scenario: Launch n browsers
        Given "school admin" logins CMS
        When school admin opens more browsers
            | type   | size |
            | chrome | 11   |
        Then school admin views all browsers
@cms @demo @network

Feature: Network environment simulation

    Scenario: Network is down
        Given "school admin" logins CMS
        When network connectivity down on CMS
        Then school admin can not connect network

    Scenario: Network is back after down
        Given "school admin" logins CMS
        When network connectivity down on CMS
        And network connectivity back to normal on CMS
        Then school admin can reload to back to the site
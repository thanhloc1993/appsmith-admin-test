@cms @learner
@user

Feature: Remembered Account screen removed from Authentication

    Background:
        Given "school admin" logins CMS
        And school admin has created a "student S1" with "parent P1" info
        And school admin has created a "student S2" with "parent P2" info

    Scenario Outline: Logout when have 2 Account in Manage Account
        When "<user_1>" logins Learner App with one of role
        And the current user has added "<user_2>" from Manage Account screen
        And "<user_2>" logs out of Learner App
        Then "<user_2>" redirects to authentication login screen
        Examples:
            | user_1                       | user_2     |
            | 1 of [student S2, parent P1] | student S1 |
            | 1 of [parent P2, student S1] | parent P1  |

    Scenario Outline: Delete all accounts in Manage Account screen
        When "<user_1>" logins Learner App with one of role
        And the current user has added "<user_2>" from Manage Account screen
        And the current user deletes all accounts
        Then "<user_2>" redirects to authentication login screen
        Examples:
            | user_1                       | user_2     |
            | 1 of [student S2, parent P1] | student S1 |
            | 1 of [parent P2, student S1] | parent P1  |

    Scenario Outline: Delete current logged in account
        When "<user_1>" logins Learner App with one of role
        And the current user has added "<user_2>" from Manage Account screen
        And "<user_2>" deletes themselves
        Then "<user_2>" redirects to authentication login screen
        Examples:
            | user_1                       | user_2     |
            | 1 of [student S2, parent P1] | student S1 |
            | 1 of [parent P2, student S1] | parent P1  |

    Scenario Outline: Delete another account in Manage Account screen
        When "<user_1>" logins Learner App with one of role
        And the current user has added "<user_2>" from Manage Account screen
        And the current user deleted account of "<user_1>"
        Then "<user_2>" is on Manage Account Screen
        And the current user does not see the account of "<user_1>" on Manage Account Screen and Switch Account Screen
        Examples:
            | user_1                       | user_2     |
            | 1 of [student S2, parent P1] | student S1 |
            | 1 of [parent P2, student S1] | parent P1  |

    Scenario: Saved account cleared after logout
        When "student S1" logins Learner App
        And "student S1" logs out of Learner App
        And the current user logs in as "student S2" on Learner App
        And the current user goes to Manage Account Screen
        Then "student S2" is on Manage Account Screen
        And the current user does not see the account of "student S1" on Manage Account Screen and Switch Account Screen

    Scenario: Add a new account in Manage Account Screen
        When "student S1" logins Learner App
        And the current user has added "student S2" from Manage Account screen
        Then "student S2" sees their account and the account of "student S1" on the Switch Account and Manage Account screen

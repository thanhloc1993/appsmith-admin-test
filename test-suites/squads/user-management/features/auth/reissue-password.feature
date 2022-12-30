@cms @user @login @reissue-password
Feature: Reissue password

    Background:
        Given "school admin" logins CMS
        And school admin has created 1 student with student info and parent info

    @blocker
    Scenario Outline: Reissue <user> password
        When school admin reissues "<user>" password
        And school admin "confirm" reissue password
        Then "<user>" password is reissued
        And "<user>" logins failed with old username and old password
        And "<user>" logins successfully with old username and new password

        @learner
        Examples:
            | user    |
            | student |

        @parent
        Examples:
            | user   |
            | parent |

    Scenario Outline: Able to cancel reissue password
        When school admin reissues "<user>" password
        And school admin "declines" reissue password
        Then the account "<user>" does not reissue password

        @learner
        Examples:
            | user    |
            | student |

        @parent
        Examples:
            | user   |
            | parent |

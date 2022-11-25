@cms @learner @parent
@user @student-info @ignore
Feature: Switch account after reissue password

    Background:
        Given "school admin" logins CMS
        And school admin has created a "student 1" with "parent 1" info
        And school admin has created a "student 2" with "parent 2" info
        # In these next step, need to cover adds multiple users on Account Screen
        And "student 1" logins Learner App
        And "student 2" logins Learner App
        And "parent 1" logins Learner App
        And "parent 2" logins Learner App

    Scenario Outline: <user_1> logins again when <user_1> has reissued password and switches from <user_2> later
        Given school admin reissues "<user_1>" password
        And "<user_2>" is active on Learner App
        When "<user_2>" "<action>" account to "<user_1>"
        Then "<user_1>" logins failed with old username and old password
        And "<user_1>" logins successfully with old username and new password
        Examples:
            | user_1                      | user_2                      | action                                 |
            | student 1                   | student 2                   | 1 of [switches, logs out and switches] |
            | 1 of [student 1, student 2] | 1 of [parent 1, parent 2]   | 1 of [switches, logs out and switches] |
            | parent 1                    | parent 2                    | 1 of [switches, logs out and switches] |
            | 1 of [parent 1, parent 2]   | 1 of [student 1, student 2] | 1 of [switches, logs out and switches] |
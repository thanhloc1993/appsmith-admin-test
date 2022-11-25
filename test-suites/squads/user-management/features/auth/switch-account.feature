@cms @learner @parent
@user @student-info @ignore
Feature: Switch account

    Background:
        Given "school admin" logins CMS
        And school admin has created a "student 1" with "parent 1" info
        And school admin has created a "student 2" with "parent 2" info
        # In these next step, need to cover adds multiple users on Account Screen
        And "student 1" logins Learner App
        And "student 2" logins Learner App
        And "parent 1" logins Learner App
        And "parent 2" logins Learner App

    Scenario Outline: Switch accounts between <user_1> & <user_2>
        Given "<user_1>" is active on Learner App
        When "<user_1>" "<action>" account to "<user_2>"
        Then "<user_2>" logins successfully
        And "<user_2>" data is displayed

        Examples:
            | user_1                      | user_2                      | action                                 |
            | student 1                   | student 2                   | 1 of [switches, logs out and switches] |
            | 1 of [student 1, student 2] | 1 of [parent 1, parent 2]   | 1 of [switches, logs out and switches] |
            | parent 1                    | parent 2                    | 1 of [switches, logs out and switches] |
            | 1 of [parent 2, parent 1]   | 1 of [student 1, student 2] | 1 of [switches, logs out and switches] |

    Scenario Outline: Still working on the <user_1> after switching back from <user_2> to <user_1>
        # Instruction: Need check user_2 login after switch from user_1, and user_2 data is displayed
        Given "<user_1>" switches account to "<user_2>"
        When "<user_2>" "<action>" account to "<user_1>"
        Then "<user_1>" logins successfully
        And "<user_1>" data is displayed
        Examples:
            | user_1                      | user_2                      | action                                 |
            | student 1                   | student 2                   | 1 of [switches, logs out and switches] |
            | 1 of [student 1, student 2] | 1 of [parent 1, parent 2]   | 1 of [switches, logs out and switches] |
            | parent 1                    | parent 2                    | 1 of [switches, logs out and switches] |
            | 1 of [parent 2, parent 1]   | 1 of [student 1, student 2] | 1 of [switches, logs out and switches] |
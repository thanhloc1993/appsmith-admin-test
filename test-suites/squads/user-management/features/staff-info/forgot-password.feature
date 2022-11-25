@user @cms @teacher
@staff-info

Feature: Forgot Password

    Scenario: Reset staff's password by forgot password
        Given "school admin" logins CMS
        And school admin has created a staff
        When staff resets password by forgot password feature
        Then staff logins Teacher App successfully with new password

    Scenario: Reset school admin's password by forgot password
        Given school admin has not logged in yet
        When school admin resets password by forgot password feature
        Then school admin logins CMS successfully with new password

    Scenario Outline: Forgot password with edited staff email
        Given "school admin" logins CMS
        And school admin has created a staff
        And school admin has edited a staff email
        When staff resets password by forgot password feature
        Then staff "<results>" CMS with "<value>"
        And staff "<results>" Teacher Web with "<value>"
        Examples:
            | results       | value                      |
            | can login     | new email and new password |
            | can not login | new email and old password |
            | can not login | old email and new password |
            | can not login | old email and old password |

    @ignore
    Scenario: Unable to Reset staff's password by forgot password for old Email
        Given "school admin" logins CMS
        And school admin has created a staff
        And school admin has edited a staff email
        When staff resets password with old email
        Then staff sees error message
        And staff can not submit with old email
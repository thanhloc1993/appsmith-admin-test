@cms @learner @parent
@user @ignore

Feature: Unable to use an invalid URL

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info

    Scenario Outline: Not Logged in User (Student/Parent) uses an invalid login URL
        When "<user>" opens Learner Web
        And "<user>" enters "/#/authMultiUsersScreen" into URL link
        And "<user>" sees a 404 Error screen
        And "<user>" clicks return to website
        Then "<user>" sees the authentication login screen
        Examples:
            | user    |
            | student |
            | parent  |

    Scenario Outline: User (Student/Parent) uses an invalid login URL
        When "<user>" logins Learner Web
        And "<user>" enters "/#/authMultiUsersScreen" into URL link
        And "<user>" sees a 404 Error screen
        And "<user>" clicks return to website
        Then "<user>" sees the "<screenName>" screen
        Examples:
            | user    | screenName |
            | student | Home       |
            | parent  | Message    |

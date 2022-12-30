@cms @learner @parent
@communication
@compose-notification

Feature: Send notification for active audience in active course

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "student" logins Learner App
        And "parent P1" logins Learner App
        And "school admin" is at "Notification" page on CMS

    Scenario Outline: <userAccount> do not receive notification when their course has <condition>
        Given school admin has set course which has "<condition>" for student
        When school admin creates "<notification>" and send to "<userAccount>" of user's course and user's grade
        Then "<userAccount>" "do not receive" notification on Learner App
        Examples:
            | userAccount                                      | condition                 | notification       |
            | 1 of [student and parent P1, student, parent P1] | end date < current date   | notification       |
            | 1 of [student and parent P1, student, parent P1] | start date > current date | notification       |
            | 1 of [student and parent P1, student, parent P1] | end date < current date   | draft notification |
            | 1 of [student and parent P1, student, parent P1] | start date > current date | draft notification |

    Scenario Outline: <userAccount> receive notification after editing timeline
        Given school admin has set course which has "<condition1>" for student
        And school admin has set course which has "<condition2>" for student
        When school admin creates notification and sends to "<userAccount>" of all course and grade
        Then "<userAccount>" "receive" notification on Learner App
        Examples:
            | userAccount                                      | condition1                | condition2                             |
            | 1 of [student and parent P1, student, parent P1] | end date < current date   | start date <= current date <= end date |
            | 1 of [student and parent P1, student, parent P1] | start date > current date | start date <= current date <= end date |

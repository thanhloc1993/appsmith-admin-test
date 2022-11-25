@cms @teacher @learner
@virtual-classroom
@virtual-classroom-polling-create

Feature: Student can see incorrect polling answer
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson management with start date&time is more than 10 minutes from now
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario Outline: Student can see their <answerOption> option is incorrect after submitting
        Given "teacher" has opened polling on Teacher App
        And "teacher" has added "E, F, G, H, I, J" to polling answer options on Teacher App
        And "teacher" has set correct answer is "A" option
        And "teacher" has started polling on Teacher App
        When "student" submits "<answerOption>" option on Learner App
        Then "student" sees red incorrect banner on Learner App
        And "student" sees submit button is disabled on Learner App
        And "student" sees their selected "<answerOption>" option is red on Learner App
        Examples:
            | answerOption |
            | B            |
            | C            |
            | D            |
            | E            |
            | F            |
            | G            |
            | H            |
            | I            |
            | J            |

    Scenario: Student can see their answer is incorrect after submitting
        Given "teacher" has opened polling on Teacher App
        And "teacher" has set correct answer is "B" option
        And "teacher" has started polling on Teacher App
        When "student" submits "A" option on Learner App
        Then "student" sees red incorrect banner on Learner App
        And "student" sees submit button is disabled on Learner App
        And "student" sees their selected "A" option is red on Learner App

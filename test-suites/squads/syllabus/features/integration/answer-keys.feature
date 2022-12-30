@cms @teacher @learner
@syllabus @exam-lo @exam-lo-common

Feature: Answer keys
    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "simple content with 5 question exam lo" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0581
    Scenario: At nth question in Answer Keys, student selects to go next
        Given student has gone to Answer Keys screen from "Course screen"
        And student is at random nth question with 0 < n < N
        When student goes to next question by next button
        Then student is at [n+1]th question of Answer Keys

    #TCID:syl-0582,syl-0583
    Scenario Outline: At last question in Answer Keys, student selects to go next
        Given student has gone to Answer Keys screen from "<fromScreen>"
        And student is at the last question
        When student goes to next question by next button
        Then student goes to "<destinationScreen>"
        Examples:
            | fromScreen    | destinationScreen          |
            | Todo screen   | Todo screen                |
            | Course screen | Quiz Finished Topic Screen |

    #TCID:syl-0584,syl-0585,syl-0586,syl-0587
    Scenario Outline: Student goes back while viewing Answer Keys
        Given student has gone to Answer Keys screen from "<fromScreen>"
        And student is at random nth question
        When student selects top Back button in Answer Keys screen
        Then student goes to "<backScreen>"
        Examples:
            | fromScreen    | backScreen          |
            | Todo screen   | Todo screen         |
            | Course screen | Topic detail screen |
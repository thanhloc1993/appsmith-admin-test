@cms @teacher @learner
@syllabus @exam-lo @exam-lo-common

Feature: View answer keys exam lo

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content with 5 question exam lo" book
        And school admin has created a matched studyplan for student

    Scenario Outline: Student view answer keys when not submitted before
        Given student has submitted exam lo with doing <some> questions
        And student goes to Quiz Achievement Screen
        When student taps to View Answer Keys button
        Then student goes to Answer Keys Screen
        And student can go random question for nth times in Answer Keys Screen
        And student can not submit at Answer Keys Screen

        Examples:
            | some |
            | 0    |
            | 3    |
            | 5    |

    Scenario Outline: Student view answer keys when submitted before
        Given student has submitted exam lo with doing 0 questions
        And student has taken again exam lo mode with doing <some> questions
        And student goes to Quiz Achievement Screen
        When student taps to View Answer Keys button
        Then student goes to Answer Keys Screen
        And student can go random question for nth times in Answer Keys Screen
        And student can not submit at Answer Keys Screen

        Examples:
            | some |
            | 0    |
            | 3    |
            | 5    |

@cms @teacher @learner
@syllabus @exam-lo @exam-lo-common

Feature: Go to next question at exam lo

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content with 5 question exam lo" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0572,syl-0573
    # nth time = 2nd time or 3rd time or 4th time
    Scenario: Goes to next question from nth question when not do and submit question yet
        Given student opens exam lo at nth time
        And student is at random nth question with 0 < n < N
        When student goes to next question by next button
        Then student is at [n+1]th question of Exam LO Quiz
        And student can submit at that question

    #TCID:syl-0573
    Scenario: Goes to next question from nth question when do 2 questions
        Given student does 2 questions of exam lo
        And student is at random nth question with 0 < n < N
        When student goes to next question by next button
        Then student is at [n+1]th question of Exam LO Quiz
        And student can submit at that question

    #TCID:syl-0574
    Scenario Outline: Goes to next question from nth question when has submitted <some> questions from Course Screen
        Given student has submitted exam lo with doing <some> questions
        And student reopens exam lo from Course Screen and go to Take Again mode
        And student is at random nth question with 0 < n < N
        When student goes to next question by next button
        Then student is at [n+1]th question of Exam LO Quiz
        And student can submit at that question

        Examples:
            | some |
            | 0    |
            | 2    |

    #TCID:syl-0575
    Scenario Outline: Goes to next question from nth question when has submitted <some> questions from Todo Screen
        Given student has submitted exam lo with doing <some> questions
        And student reopens exam lo from Todo Screen and go to Take Again mode
        And student is at random nth question with 0 < n < N
        When student goes to next question by next button
        Then student is at [n+1]th question of Exam LO Quiz
        And student can submit at that question

        Examples:
            | some |
            | 0    |
            | 2    |
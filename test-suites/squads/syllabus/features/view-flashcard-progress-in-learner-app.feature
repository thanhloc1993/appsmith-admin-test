@cms @teacher @learner
@syllabus @flashcard @flashcard-common

Feature: View Flashcard Progress in Flashcard Learn

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content have 5 card" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0290
    Scenario Outline: View flashcard progress in Flashcard Learn screen after learning <number> card
        Given student goes to Flashcard Learn screen
        When student learns until card's position <number> with skipping <skipped> cards
        Then student sees progress bar show current with total cards
        And student sees the number of skipped cards is <skipped>
        And student sees the number of remembered cards is <remembered>

        Examples:
            | number | skipped | remembered |
            | 0      | 0       | 0          |
            | 1      | 0       | 1          |
            | 1      | 1       | 0          |
            | 2      | 1       | 1          |
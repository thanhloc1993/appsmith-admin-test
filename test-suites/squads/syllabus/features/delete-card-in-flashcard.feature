@cms @learner @teacher
@syllabus @flashcard @flashcard-common

Feature: Delete card in flashcard

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content have 5 card" book
        And school admin has created a matched studyplan for student
        And school admin is at book detail page
        And school admin goes to the flashcard detail page
        And school admin is at add-edit card page in flashcard
        And teacher sees created cards in flashcard
        And student sees created cards in flashcard

    #TCID:syl-0084,syl-0085
    Scenario Outline: School admin delete card in flashcard
        When school admin deletes "<total>" cards in the flashcard
        Then school admin saves after deleting cards
        And school admin does not see the deleted card
        And student does not see the deleted card
        And teacher does not see the deleted card
        Examples:
            | total                |
            | 1 of [one]           |
            | 1 of [all, multiple] |
@cms @teacher @learner
@syllabus @flashcard @flashcard-common
@staging

Feature: Stop Learning in Flashcard Learn Screen by select Top Back Button

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content have 5 card" book
        And school admin has created a matched studyplan for student

    #`student's progress bar is saved as <number> with total card` will back to Flashcard Learn screen to check
    # progress number = number + 1
    #TCID:syl-0277
    Scenario Outline: Stop Learning in Flashcard Learn Screen by select Top Back Button after learning <number> cards
        Given student goes to Flashcard Learn screen
        And student stands at card's position <number> with skipping <skipped> cards
        When student selects top back button in Flashcard Learn screen
        Then student sees Flashcard Detail screen
        And student backs to Flashcard Learn Screen
        And student sees progress bar show progress <progress> with total cards
        And student sees the number of skipped cards is <skipped>
        And student sees the number of remembered cards is <remembered>

        Examples:
            | number | skipped | remembered | progress |
            | 0      | 0       | 0          | 1        |
            | 1      | 0       | 1          | 2        |
            | 1      | 1       | 0          | 2        |
            | 2      | 1       | 1          | 3        |

    #TCID:syl-0279
    Scenario Outline: Stop Learning in Flashcard Learn Screen by select Top Back Button after continue learning <number> cards
        Given student has learned "all" cards in flashcard with skipping 5 cards
        And student continues learning and stands at card's position <number> with skipping <skipped> cards
        When student selects top back button in Flashcard Learn screen
        Then student sees Flashcard Detail screen
        And student backs to Flashcard Learn Screen
        And student sees progress bar show progress <progress> with total cards
        And student sees the number of skipped cards is <skipped>
        And student sees the number of remembered cards is <remembered>

        Examples:
            | number | skipped | remembered | progress |
            | 0      | 0       | 0          | 1        |
            | 1      | 0       | 1          | 2        |
            | 1      | 1       | 0          | 2        |
            | 2      | 1       | 1          | 3        |

    #TCID:syl-0276
    Scenario: Stop Learning in Flashcard Learn Screen by select Top Back Button after learning all cards
        Given student has learned "all" cards in flashcard with skipping 0 cards
        And student sees congratulations card in Flashcard Learn screen
        When student selects top back button in Flashcard Learn screen
        Then student sees Flashcard Detail screen
        And student backs to Flashcard Learn Screen
        And student sees a new card set in Flashcard Learn Screen
        And teacher sees student's flashcard result is still displayed as completed

    #TCID:syl-0275
    Scenario: Stop Learning in Flashcard Learn Screen by select Top Back Button after learning all cards with skipping 1 cards
        Given student has learned "all" cards in flashcard with skipping 1 cards
        And student sees nice work card in Flashcard Learn screen
        When student selects top back button in Flashcard Learn screen
        Then student sees Flashcard Detail screen
        And student backs to Flashcard Learn Screen
        And student sees a new card set in Flashcard Learn Screen
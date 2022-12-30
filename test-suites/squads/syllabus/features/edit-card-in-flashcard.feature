@cms @learner @teacher
@syllabus @flashcard @flashcard-common

Feature: Edit cards in the flashcard

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "1 flashcard have 5 card" book
        And school admin has created a matched studyplan for student
        And school admin is at book detail page
        And school admin goes to the flashcard detail page
        And school admin is at add-edit card page in flashcard

    #TCID:syl-0076,syl-0077,syl-0078
    Scenario Outline: User can edit card
        When school admin edits "<total>" card in the flashcard
        Then school admin sees message "You have added the card successfully!"
        And school admin sees "<total>" card is updated
        And student goes to Flashcard Detail screen
        And student sees card is updated in Flashcard Detail screen
        And student sees card is updated in Flashcard Learn screen
        And teacher sees card is updated on the Teacher App

        Examples:
            | total                |
            | 1 of [one]           |
            | 1 of [multiple, all] |

    #TCID:syl-0076,syl-0077,syl-0078
    Scenario Outline: User can <action> image of card
        When school admin "<action>" image of card
        Then school admin sees message "You have added the card successfully!"
        And school admin sees "<expect>" image
        And student goes to Flashcard Detail screen
        And student can "<teacher-student action>" image in Flashcard Detail screen
        And student can "<teacher-student action>" image in Flashcard Learn screen
        And teacher can "<teacher-student action>" on the Teacher App

        Examples:
            | action | expect      | teacher-student action |
            | delete | placeholder | not see                |
            | update | new         | see                    |

    #TCID:syl-0093
    Scenario: User can add more card
        When school admin creates 1 more cards in the flashcard
        Then school admin sees message "You have added the card successfully!"
        And school admin sees newly created cards
        And student goes to Flashcard Detail screen
        And student sees newly created cards in Flashcard Detail screen
        And student sees newly created cards in Flashcard Learn screen
        And teacher sees newly created cards on the Teacher App
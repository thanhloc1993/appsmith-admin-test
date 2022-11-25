@cms
@cms-syllabus-integration
@syllabus @flashcard

Feature: [Integration] Edit cards in the flashcard in CMS

    Background:
        Given "school admin" logins CMS
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content have 5 card" book
        And school admin is at book detail page
        And school admin goes to the flashcard detail page
        And school admin is at add-edit card page in flashcard

    #TCID:syl-0033
    Scenario Outline: User can edit card
        When school admin edits "<total>" card in the flashcard
        Then school admin sees message "You have added the card successfully!"
        And school admin sees "<total>" card is updated

        Examples:
            | total    |
            | one      |
            | multiple |
            | all      |

    #TCID:syl-0854
    Scenario: User cancel edit card
        Given school admin edits data "1 of [one, multiple, all]" card in the flashcard
        When school admin cancel add-edit card in the flashcard
        Then school admin still sees card no change

    #TCID:syl-0992
    Scenario Outline: User can edit image of card
        When school admin "<action>" image of card
        Then school admin sees message "You have added the card successfully!"
        And school admin sees "<expect>" image

        Examples:
            | action | expect      |
            | delete | placeholder |
            | update | new         |

    #TCID:syl-0993
    Scenario: User can add more card
        When school admin creates 1 more cards in the flashcard
        Then school admin sees message "You have added the card successfully!"
        And school admin sees newly created cards
        And school admin sees all cards

@cms
@cms-syllabus-integration
@syllabus @flashcard

Feature: [Integration] Delete cards in the flashcard

        Background:
                Given "school admin" logins CMS
                # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 5
                And school admin has created a "simple content have 5 card" book
                And school admin is at book detail page
                And school admin goes to the flashcard detail page
                And school admin is at add-edit card page in flashcard

        #TCID:syl-0038
        Scenario Outline: User can delete card
                When school admin deletes "<total>" cards in the flashcard
                Then school admin sees message "You have deleted the card successfully!"
                And school admin saves after deleting cards
                And school admin does not see the deleted card

                Examples:
                        | total                |
                        | 1 of [one]           |
                        | 1 of [all, multiple] |

        #TCID:syl-0864
        Scenario Outline: User can delete card without save
                When school admin deletes "one" cards in the flashcard
                Then school admin sees message "You have deleted the card successfully!"
                And school admin "<action>" add-edit page
                And school admin does not see the deleted card

                Examples:
                        | action |
                        | cancel |
                        | leave  |

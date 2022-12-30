@cms
@cms-syllabus-integration
@syllabus @flashcard

Feature: [Integration] Create cards in the flashcard in CMS

        Background:
                Given "school admin" logins CMS
                And school admin has created a "has 1 flashcard" book
                And school admin is at book detail page
                And school admin goes to the flashcard detail page
                And school admin is at add-edit card page in flashcard

        #TCID:syl-0059,syl-0060,syl-0061,syl-0012
        Scenario Outline: User can create card with required field
                When school admin creates "<number>" card in the flashcard
                Then school admin sees message "You have added the card successfully!"
                And school admin sees "<number>" card is created

                Examples:
                        | number   |
                        | one      |
                        | multiple |

        #TCID:syl-0848
        Scenario: User cancel create card
                Given school admin fills card form in the flashcard
                When school admin cancel add-edit card in the flashcard
                Then school admin sees empty card in the flashcard

        #TCID:syl-0257,syl-0258
        Scenario Outline: User can create card with upload image
                When school admin creates cards in the flashcard with image "<case>" limit size
                Then school admin sees message "You have added the card successfully!"
                And school admin sees cards is created and can "<action>" image

                Examples:
                        | case               | action  |
                        | greater than       | not see |
                        | less than or equal | see     |

        #TCID:syl-0970,syl-0013
        Scenario Outline: User can't create card when missing required field
                When school admin creates card in the flashcard when missing "<requiredField>"
                Then school admin can't create any card when missing "<requiredField>"
                Examples:
                        | requiredField |
                        | definition    |
                        | term          |

        #TCID:syl-0252,syl-0253
        Scenario Outline: User create card with audio is generated when language is "<language>"
                When school admin creates card in the flashcard with language "<language>"
                Then school admin sees message "You have added the card successfully!"
                And school admin can "<action>" audio generated

                Examples:
                        | language  | action  |
                        | 1 of [EN] | see     |
                        | 1 of [JP] | not see |

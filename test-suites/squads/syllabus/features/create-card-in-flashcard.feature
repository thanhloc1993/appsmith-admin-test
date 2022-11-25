@cms @learner @teacher
@syllabus @flashcard @flashcard-common

Feature: Create cards in the flashcard

        Background:
                Given "school admin" logins CMS
                And "teacher" logins Teacher App
                And "student" logins Learner App
                And school admin has created a "has 1 flashcard" book
                And school admin has created a matched studyplan for student
                And school admin is at book detail page
                And school admin goes to the flashcard detail page
                And school admin is at add-edit card page in flashcard

        #TCID:syl-1067
        Scenario Outline: User can create card with required field
                When school admin creates "<number>" card in the flashcard
                Then school admin sees message "You have added the card successfully!"
                And school admin sees "<number>" card is created
                And student goes to Flashcard Detail screen
                And student sees the new cards in Flashcard Detail screen
                And student sees the new cards in Flashcard Learn screen
                And teacher sees the new cards on Teacher App

                Examples:
                        | number   |
                        | one      |
                        | multiple |

        #TCID:syl-0255
        @blocker
        Scenario: User can create card with image
                When school admin creates cards in the flashcard with image "less than or equal" limit size
                Then school admin sees message "You have added the card successfully!"
                And school admin sees cards is created and can "see" image
                And student goes to Flashcard Detail screen
                And student sees cards is created with image in Flashcard Detail screen
                And student sees cards is created with image in Flashcard Learn screen
                And teacher sees cards is created with image on Teacher App

        #TCID:syl-0252,syl-0253
        Scenario Outline: User create card with audio is generated when language is <language>
                When school admin creates card in the flashcard with language "<language>"
                Then school admin sees message "You have added the card successfully!"
                And school admin can "<action>" audio generated
                And student goes to Flashcard Detail screen
                And student can "<action>" audio generated in Flashcard Detail screen
                And student can "<action>" audio generated in in Flashcard Learn screen

                Examples:
                        | language  | action  |
                        | 1 of [EN] | see     |
                        | 1 of [JP] | not see |

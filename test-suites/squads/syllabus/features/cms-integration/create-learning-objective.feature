@cms
@cms-syllabus-integration
@syllabus @learning-objective

Feature: [Integration] Create new LO(learning objective, flashcard, exam) integration test
    Background:
        Given "school admin" logins CMS
        And school admin has created a "has chapter and topic only" book

    #TCID:syl-0007
    Scenario Outline: Create new LO <LOType>
        Given school admin is at book detail page
        When school admin creates a LO "<LOType>" in book
        Then school admin sees message "You have created a new LO successfully"
        And school admin sees the new LO "<LOType>" created on CMS

        Examples:
            | LOType             |
            | learning objective |
            | flashcard          |

    #TCID:syl-0008
    Scenario Outline: Can't create LO <LOType> when missing <missingField>
        Given school admin is at book detail page
        When school admin creates a LO "<LOType>" with missing "<missingField>"
        Then school admin cannot create any LO

        Examples:
            | LOType             | missingField |
            | learning objective | name         |
            | flashcard          | name         |

    #TCID:syl-0008
    Scenario: Can't create LO <LOType> when don't select LO type
        Given school admin is at book detail page
        When school admin creates a LO "<LOType>" with missing "type"
        Then school admin cannot create any LO

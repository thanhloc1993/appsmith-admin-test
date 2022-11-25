@cms
@cms-syllabus-integration
@syllabus @learning-objective

Feature: [Integration] Delete learning objective integration

    Background:
        Given "school admin" logins CMS
        And school admin has created a "simple content with all LO type" book
        And school admin is at book detail page

    #TCID:syl-0036
    Scenario Outline: Can delete the <LOType> in the <place>
        Given school admin select a LO "<LOType>" in "<place>" to delete
        When school admin "confirms" the deleting LO process
        Then school admin sees message "You have deleted learning objective successfully"
        And school admin does not see the deleted LO in book

        Examples:
            | LOType                                        | place  |
            | 1 of [learning objective, flashcard, exam LO] | book   |
            | 1 of [learning objective, flashcard, exam LO] | detail |

    #TCID:syl-0862
    Scenario Outline: Can't delete the <LOType> in the <place>
        Given school admin select a LO "<LOType>" in "<place>" to delete
        When school admin "cancels" the deleting LO process
        Then school admin still sees the LO in "<place>"

        Examples:
            | LOType                                        | place  |
            | 1 of [learning objective, flashcard, exam LO] | book   |
            | 1 of [learning objective, flashcard, exam LO] | detail |

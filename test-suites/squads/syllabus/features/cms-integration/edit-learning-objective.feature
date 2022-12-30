@cms
@cms-syllabus-integration
@syllabus @learning-objective

Feature: [Integration] Edit LO integration test

    Background:
        Given "school admin" logins CMS
        And school admin has created a "simple content without quiz" book
        And school admin is at book detail page

    Scenario Outline: User can edit LO <LOType> in <place>
        Given school admin is at book detail page
        When school admin selects a LO "<LOType>" in "<place>" to edit
        Then school admin edits LO
        And school admin sees message edit LO "<LOType>" success
        And school admin sees the edited LO in "<place>"

        Examples:
            | LOType                               | place  |
            | 1 of [learning objective, flashcard] | book   |
            | 1 of [learning objective, flashcard] | detail |

    Scenario Outline: User can't edit LO's <LOType> in <place> when missing <field>
        Given school admin is at book detail page
        When school admin selects a LO "<LOType>" in "<place>" to edit
        Then school admin edits LO with missing "<field>"
        And school admin cannot edit LO

        Examples:
            | LOType                               | field | place  |
            | 1 of [learning objective, flashcard] | name  | book   |
            | 1 of [learning objective, flashcard] | name  | detail |

    Scenario Outline: User can upload learning objective <material>
        Given school admin goes to the LO "learning objective" detail page
        When school admin upload "<material>" in LO
        Then school admin sees message "You have updated learning objective successfully"
        And school admin sees the "<material>" uploaded in LO "learning objective"

        Examples:
            | material         |
            | video            |
            | brightcove video |
            | pdf              |

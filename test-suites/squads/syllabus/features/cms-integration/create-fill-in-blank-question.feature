@cms
@syllabus
@cms-syllabus-integration
@question
@ignore

Feature: [Integration] Create the fill in the blank question integration test

    Background:
        Given "school admin" logins CMS
        And school admin has created a "has 1 learning objective" book
        And school admin goes to book detail page
        And school admin goes to create question page

    #TCID:None
    Scenario Outline: School admin can create fill in the blank question with label type <labelType>
        When school admin creates a fill in blank question with label type "<labelType>"
        Then school admin sees message "You have created a new question successfully"
        And school admin sees the newly created fill in the blank question with label type "<labelType>"

        Examples:
            | labelType     |
            | random        |
            | without label |

    #TCID:None
    Scenario Outline: School admin can create in the blank question with <answerAction> answers and <alternativeAction> alternative
        When school admin creates a fill in the blank question with "<answerAction>" answers and "<alternativeAction>" alternative
        Then school admin sees message "You have created a new question successfully"
        And school admin sees the newly created fill in the blank question

        Examples:
            | answerAction | alternativeAction    |
            | default      | 1 of[none]           |
            | default      | 1 of[multiple]       |
            | multiple     | 1 of[none, multiple] |

    #TCID:None
    Scenario Outline: School admin cannot create fill in the blank question when missing <field>
        When school admin creates a fill in the blank question with missing "<field>"
        Then school admin cannot create any question

        Examples:
            | field        |
            | answer label |
            | answer       |
            | alternative  |

    #TCID:None
    Scenario: School admin cannot create fill in the blank question without the answer
        When school admin creates a fill in the blank question without the answer
        Then school admin cannot create any question

@cms
@syllabus
@cms-syllabus-integration
@question-v2 @staging

Feature: [Integration] Create the fill in the blank answers question integration V2

    Background:
        Given "school admin" logins CMS
        And school admin has created a "simple content with 1 LO learning" book
        And school admin goes to book detail page
        And school admin goes to the new create question page

    #TCID:syl-0009,
    Scenario Outline: School admin can create fill in the blank question with label type <type>
        When school admin creates fill in blank question with label type "<type>"
        Then school admin sees message "You have created a new question successfully"
        And school admin sees the newly created fill in the blank answers question

        Examples:
            | type                                    |
            | 1 of [random label type, no label type] |

    #TCID:syl-0971
    Scenario Outline: School admin can create in the blank question with <action> answers and <alternative> alternative
        When school admin creates fill in the blank question with "<action>" answers and "<alternative>" option
        Then school admin sees message "You have created a new question successfully"
        And school admin sees the newly created fill in the blank answers question

        Examples:
            | action   | alternative           |
            | one      | 1 of [none]           |
            | one      | 1 of [multiple]       |
            | multiple | 1 of [none, multiple] |

    #TCID:syl-0011
    Scenario Outline: School admin cannot create fill in the blank question with missing <field>
        When school admin creates fill in the blank answers question with missing "<field>"
        Then school admin sees error message on "<field>"

        Examples:
            | field                |
            | prefix label         |
            | main answer          |
            | alternative answer   |
            | question description |

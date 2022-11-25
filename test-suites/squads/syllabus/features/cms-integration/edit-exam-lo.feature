@cms
@cms-syllabus-integration
@syllabus @exam-lo
@staging

Feature: [Integration] Edit exam LO integration test
    Background:
        Given "school admin" logins CMS
        And school admin has created a "simple content with 5 question exam lo" book
        And school admin goes to book detail page

    Scenario Outline: School admin edits exam LO with <field>
        Given school admin goes to exam LO edit page
        When school admin edits exam LO with "<field>"
        Then school admin sees message "You have updated learning objective successfully"
        And school admin sees the edited exam LO on CMS

        Examples:
            | field       |
            | name        |
            | instruction |

    Scenario: School admin edits exam LO with empty instruction
        Given school admin goes to exam LO edit page
        When school admin edits exam LO with empty instruction
        Then school admin sees message "You have updated learning objective successfully"
        And school admin sees double dashes in instruction field

    Scenario Outline: School admin cannot edit exam LO when missing <field>
        Given school admin goes to exam LO edit page
        When school admin edits exam LO with missing "<field>"
        Then school admin cannot edit exam LO with missing "<field>"

        Examples:
            | field |
            | name  |

@cms
@cms-syllabus-integration
@syllabus @exam-lo
@staging

Feature: [Integration] Create exam LO integration test
    Background:
        Given "school admin" logins CMS
        And school admin has created a "has chapter and topic only" book

    Scenario Outline: School admin creates new exam LO successfully with valid fields
        Given school admin is at book detail page
        When school admin creates an exam LO in book with "<field>"
        Then school admin sees message of creating successfully
        And school admin sees the created exam LO on CMS

        Examples:
            | field              |
            | name               |
            | name & instruction |

    Scenario Outline: School admin cannot create exam LO when missing <missingField>
        Given school admin is at book detail page
        When school admin creates an exam LO in book without "<missingField>"
        Then school admin cannot create exam LO without "<missingField>"

        Examples:
            | missingField |
            | name         |

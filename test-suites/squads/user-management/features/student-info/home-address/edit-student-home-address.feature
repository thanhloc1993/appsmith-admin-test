@cms
@user @student-info

Feature: Edit Student Home Address on CMS
    Background:
        Given "school admin" logins CMS

    Scenario Outline: Edit student home address to <valueType>
        Given school admin has created a student "with" home address
        When school admin edits student home address into "<valueType>"
        Then school admin sees the edited student home address data on CMS
        Examples:
            | valueType       |
            | another address |
            | blank           |

    Scenario: Edit student home address from blank to normal
        Given school admin has created a student "without" home address
        When school admin edits student home address into "another address"
        Then school admin sees the edited student home address data on CMS
@cms
@user @student-info @ignore

Feature: View student detail

    Background:
        Given "school admin" logins CMS

    Scenario Outline: View student detail with "<locationType>" location
        Given school admin has created a student with "1" location
        And school admin has set archive value of that location is "<value>"
        When school admin views student detail by "<option>"
        Then school admin sees student info is displayed with "<locationType>" location
        Examples:
            | locationType | value           | option |
            | not archive  | is_archived = 0 | URL    |
            | not archive  | is_archived = 0 | Menu   |
            | archived     | is_archived = 1 | URL    |
            | archived     | is_archived = 1 | Menu   |

    Scenario Outline: View student detail after changed Location name
        Given school admin has created a student with "1" location
        And school admin has changed name of that location
        When school admin views student detail by "<option>"
        Then school admin sees student info is displayed with updated name on location
        Examples:
            | option |
            | URL    |
            | Menu   |

    Scenario: Unable to view student detail by invalid Student-Id in URL link
        Given school admin has created a student with "1" location
        When school admin views student detail by URL
        And school admin changes student-Id on URL link
        Then school admin sees 404 error page display
@cms
@user @staff-info

Feature: Search for staff name

    Background:
        Given "school admin" logins CMS
        And staff list has many records

    Scenario Outline: Search staff by "<option>"
        When school admin searches staff by "<option>"
        Then the staff list is displayed staff which matches keywords
        Examples:
            | option                             |
            | partial name                       |
            | full name                          |
            | keyword with single capital letter |
            | keyword with all capital letter    |

    Scenario: Search for non-existed staff name
        When school admin searches staff by non-existed keywords
        Then no result page is displayed

    Scenario: Search for edited staff name
        Given school admin has edited staff name
        When school admin searches for old staff name
        Then no result page is displayed

    @ignore
    Scenario: Able to clear search for staff name
        When school admin searches for keywords
        And school admin removes the keywords
        Then the staff list is displayed full records

    @ignore
    Scenario: Go to first page of result after searching staff name
        Given school admin is not on the "first" page of staff list
        And school admin changes the rows per page into "5"
        When school admin searches for keywords
        Then school admin is on the first page of staff list with "5" rows per page
        And the staff list is displayed staff which matches keywords

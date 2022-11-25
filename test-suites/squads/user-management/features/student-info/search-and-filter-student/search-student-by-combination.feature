@cms
@user @student-search-filter
Feature: Search student by combination

    Background:
        Given "school admin" logins CMS
        And student list has many records

    Scenario Outline: Search for student name then filter student
        # need to verify the student list is displayed student which matches keywords on step Given
        Given school admin searches for keywords
        When school admin filters student by "<option>"
        Then the student list is displayed student which matches keywords and "<option>"
        Examples:
            | option           |
            | grade            |
            | course           |
            | grade and course |

    Scenario Outline: Filter student then search for student name
        # need to verify the student list is displayed student which matches "<option>" on step Given
        Given school admin filters student by "<option>"
        When school admin searches for keywords
        Then the student list is displayed student which matches keywords and "<option>"
        Examples:
            | option           |
            | grade            |
            | course           |
            | grade and course |
    @ignore
    Scenario Outline: Display student list which matches keywords after remove the filter
        Given school admin "<action1>"
        When school admin "<action2>"
        And school admin removes filter on "<place>"
        Then the student list is displayed student which matches keywords
        Examples:
            | action1               | action2               | place        |
            | filters student       | searches for keywords | filter popup |
            | searches for keywords | filters student       | student page |
    @ignore
    Scenario Outline: Display student list which matches filter after remove the keywords
        Given school admin "<action1>"
        When school admin "<action2>"
        And school admin removes keywords
        Then the student list is displayed student which matches filter
        Examples:
            | action1               | action2               |
            | filters student       | searches for keywords |
            | searches for keywords | filters student       |
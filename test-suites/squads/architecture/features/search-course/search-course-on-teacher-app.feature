@cms @teacher
@architecture
@course

Feature: Teacher can search course by course name on Teacher App
    Background:
        Given "school admin" logins CMS
        And school admin has created a course under first granted location
        And "teacher" logins Teacher App
        And "teacher" has refreshed their browser on Teacher App

    Scenario: Teacher can search course by the existed keyword
        When "teacher" searches course by the keyword
        Then "teacher" sees course which course name contains the keyword

    Scenario: Teacher cannot search course by non-existed keyword
        When "teacher" searches course by non existed keyword
        Then "teacher" sees no course result

    Scenario: Teacher still can see result list when removing keyword but not pressing enter
        Given "teacher" has searched course by the keyword
        When "teacher" removes the keyword in the search bar on Teacher app
        Then "teacher" sees course which course name contains the keyword

    Scenario: Teacher can remove the keyword in the search bar
        Given "teacher" has searched course by the keyword
        When "teacher" removes the keyword in the search bar on Teacher app
        And "teacher" presses enter
        Then "teacher" sees full course list
        And "teacher" does not see the keyword in the search bar on Teacher App

    Scenario: Teacher still can see the keyword when going to course detail page and back to course list
        Given "teacher" has searched course by the keyword
        When "teacher" goes to detailed course page on Teacher App
        And "teacher" backs to course list on Teacher App
        Then "teacher" sees course which course name contains the keyword
        And "teacher" sees the keyword in the search bar on Teacher App

    Scenario Outline: The keyword is removed when teacher goes to <page> and back to course list
        Given "teacher" has searched course by the keyword
        When "teacher" goes to "<page>" on Teacher App
        And "teacher" backs to course list on Teacher App
        Then "teacher" sees full course list
        And "teacher" does not see the keyword in the search bar on Teacher App
        Examples:
            | page      |
            | To Review |
            | Message   |
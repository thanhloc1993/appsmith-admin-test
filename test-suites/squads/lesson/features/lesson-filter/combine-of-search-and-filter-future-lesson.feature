@cms
@lesson
@lesson-filter

Feature: School admin can combine of search and filter future lesson
    Background:
        Given "school admin" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "school admin" has gone to "future" lessons list page

    Scenario Outline: school admin can combine of search and filter lesson
        Given "school admin" has chosen "<number1>" lessons per page
        When "school admin" filters "<option1>" and "<option2>"
        And "school admin" searches for the keyword
        And "school admin" chooses "<number2>" lessons per page
        Then "school admin" is redirected to the first result page
        And "school admin" sees the keyword in the search bar
        And "school admin" sees "<option1>" and "<option2>" chip filters in result page
        And "school admin" sees "<option1>" and "<option2>" chip filters in filter popup
        And "school admin" sees lessons list which matches "<option1>" and "<option2>" and contains the keyword
        Examples:
            | number1 | number2                | option1                                                                                                       | option2                            |
            | 5       | 1 of [10, 25, 50, 100] | 1 of [Lesson Start Date, Lesson End Date, Start Time, End Time, Lesson day of the week, Teacher Name, Center] | 1 of [Student Name, Grade, Course] |
            | 10      | 1 of [5, 25, 50, 100]  | 1 of [Lesson Start Date, Lesson End Date, Start Time, End Time, Lesson day of the week, Teacher Name, Center] | 1 of [Student Name, Grade, Course] |
            | 25      | 1 of [5, 10, 50, 100]  | 1 of [Lesson Start Date, Lesson End Date, Start Time, End Time, Lesson day of the week, Teacher Name, Center] | 1 of [Student Name, Grade, Course] |
            | 50      | 1 of [5, 10, 25, 100]  | 1 of [Lesson Start Date, Lesson End Date, Start Time, End Time, Lesson day of the week, Teacher Name, Center] | 1 of [Student Name, Grade, Course] |
            | 100     | 1 of [5, 10, 25, 50]   | 1 of [Lesson Start Date, Lesson End Date, Start Time, End Time, Lesson day of the week, Teacher Name, Center] | 1 of [Student Name, Grade, Course] |

    Scenario Outline: school admin can remain searching by keyword after clearing all filters
        Given "school admin" has filtered "<option1>" and "<option2>"
        And "school admin" has searched for the keyword
        When "school admin" clears all chip filters in result page
        Then "school admin" sees the keyword in the search bar
        And "school admin" does not see chip filters in result page
        And "school admin" does not see chip filters in filter popup
        And "school admin" sees a lessons list which have students with name contains the keyword
        Examples:
            | option1                                                                                                       | option2                            |
            | 1 of [Lesson Start Date, Lesson End Date, Start Time, End Time, Lesson day of the week, Teacher Name, Center] | 1 of [Student Name, Grade, Course] |
            | 2 of [Lesson Start Date, Lesson End Date, Start Time, End Time, Lesson day of the week, Teacher Name, Center] | 2 of [Student Name, Grade, Course] |

    Scenario Outline: school admin can remain filtering after clearing search keyword
        Given "school admin" has filtered "<option1>" and "<option2>"
        And "school admin" has searched for the keyword
        When "school admin" clears keyword in result page
        Then "school admin" does not sees the keyword in the search bar
        And "school admin" sees "<option1>" and "<option2>" chip filters in result page
        And "school admin" sees "<option1>" and "<option2>" chip filters in filter popup
        And "school admin" sees lessons list which matches "<option1>" and "<option2>"
        Examples:
            | option1                                                                                                       | option2                            |
            | 1 of [Lesson Start Date, Lesson End Date, Start Time, End Time, Lesson day of the week, Teacher Name, Center] | 1 of [Student Name, Grade, Course] |
            | 2 of [Lesson Start Date, Lesson End Date, Start Time, End Time, Lesson day of the week, Teacher Name, Center] | 2 of [Student Name, Grade, Course] |

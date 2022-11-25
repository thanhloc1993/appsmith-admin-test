@cms @cms2
@lesson
@lesson-filter

Feature: School admin can remove all filters result of future lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "school admin" has gone to "future" lessons list page

    Scenario Outline: School admin can reset filter in filter popup of future lesson
        Given "school admin" has filtered "<option1>" and "<option2>"
        And "school admin" has gone to another result page
        When "school admin" resets filter
        Then "school admin" is redirected to the first result page
        And "school admin" sees full lesson list
        And "school admin" does not see chip filter in result page
        Examples:
            | option1                                                                                                        | option2                            |
            | 1 of [Lesson Start Date, Lesson End Date , Start Time, End Time, Lesson day of the week, Teacher Name, Center] | 1 of [Student Name, Grade, Course] |
            | 2 of [Lesson Start Date, Lesson End Date , Start Time, End Time, Lesson day of the week, Teacher Name, Center] | 2 of [Student Name, Grade, Course] |

    Scenario Outline: School admin can clear all chips in result page of future lesson
        Given "school admin" has filtered "<option1>" and "<option2>"
        And "school admin" has gone to another result page
        When "school admin" clears all chips filter in result page
        Then "school admin" is redirected to the first result page
        And "school admin" sees full lesson list
        And "school admin" does not see chip filter in result page
        Examples:
            | option1                                                                                                        | option2                            |
            | 1 of [Lesson Start Date, Lesson End Date , Start Time, End Time, Lesson day of the week, Teacher Name, Center] | 1 of [Student Name, Grade, Course] |
            | 2 of [Lesson Start Date, Lesson End Date , Start Time, End Time, Lesson day of the week, Teacher Name, Center] | 2 of [Student Name, Grade, Course] |

@cms
@lesson
@lesson-filter
@staging
@ignore

Feature: School admin can filter past lesson by multiple options
    Background:
        Given "school admin" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "school admin" has gone to "past" lessons list page

    Scenario Outline: School admin can filter by date, time, teacher, location and student (1)
        When "school admin" filters "<StartDate>", "<EndDate>", StartTime, EndTime, Teacher, Location, Student
        Then "school admin" sees a lesson list which matches  Start&End Date, Start&End Time, Teacher, Location and Student
        And "school admin" sees Start&End Date, Start&End Time, Teacher, Location and Student chip filter in result page
        Examples:
            | StartDate      | EndDate        |
            | 1 of [Yes, No] | 1 of [Yes, No] |
            | 1 of [Yes, No] | 1 of [Yes, No] |

    Scenario Outline: School admin can filter by date, time, teacher, location and student (2)
        When "school admin" filters StartDate, EndDate, "<StartTime>", "<EndTime>", Teacher, Location, Student
        Then "school admin" sees a lesson list which matches  Start&End Date, Start&End Time, Teacher, Location and Student
        And "school admin" sees Start&End Date, Start&End Time, Teacher, Location and Student chip filter in result page
        Examples:
            | StartTime      | EndTime        |
            | 1 of [Yes, No] | 1 of [Yes, No] |
            | 1 of [Yes, No] | 1 of [Yes, No] |

    Scenario: School admin can filter by date, time, teacher, location and student (3)
        When "school admin" filters StartDate, EndDate, StartTime, EndTime,"2 Teacher", "2 Location","2 Student"
        Then "school admin" sees a lesson list which matches Start&End Date, Start&End Time, Teacher, Location and Student
        And "school admin" sees Start&End Date, Start&End Time, Teacher, Location and Student chip filter in result page
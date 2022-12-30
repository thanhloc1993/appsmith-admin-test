@cms
@lesson
@lesson-filter

Feature: School admin can remove chip filter of future lesson
    Background:
        Given "school admin" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "school admin" has gone to "future" lessons list page

    Scenario Outline: School admin can remove <option> chip filter in result page
        Given "school admin" has filtered with "Lesson Start Date, Lesson End Date, Start Time, End Time, Lesson day of the week"
        When "school admin" removes "<option>" in result page
        # Just check lesson at first row in lesson list
        Then "school admin" sees lesson list which matches "<remainedOption>"
        And "school admin" sees "<remainedOption>" chip filters in result page
        And "school admin" does not see "<option>" chip filter in result page
        Examples:
            | option            | remainedOption                                                                   |
            | Lesson Start Date | 4 of [Lesson End Date , Start Time, End Time, Lesson day of the week]            |
            | Lesson End Date   | 4 of [ Lesson Start Date , Start Time, End Time , Lesson day of the week]        |
            | Start Time        | 4 of [ Lesson Start Date , Lesson End Date , End Time , Lesson day of the week]  |
            | End Time          | 4 of [ Lesson Start Date , Lesson End Date , Start Time, Lesson day of the week] |
    # TODO: run this test case when our data is correct (currently some lessons from live lesson last many days)
    # | Lesson day of the week | 4 of [ Lesson Start Date , Lesson End Date , Start Time, End Time ] |

    Scenario Outline: School admin can remove <option> chip filter in filter popup
        Given "school admin" has filtered with "Teacher Name, Center, Student Name, Grade, Course"
        When "school admin" removes "<option>" in filter popup
        Then "school admin" sees "<remainedOption>" chip filters in result page
        And "school admin" does not see "<option>" chip filter in result page
        # Just check lesson at first row
        And "school admin" sees lesson info which matches "<remainedOption>"
        Examples:
            | option       | remainedOption                                    |
            | Teacher Name | 4 of [Center, Student Name, Grade, Course]        |
            | Center       | 4 of [Teacher Name, Student Name, Grade, Course]  |
            | Student Name | 4 of [Teacher Name, Center, Grade, Course]        |
            | Grade        | 4 of [Teacher Name, Center, Student Name, Course] |
            | Course       | 4 of [Teacher Name, Center, Student Name, Grade]  |

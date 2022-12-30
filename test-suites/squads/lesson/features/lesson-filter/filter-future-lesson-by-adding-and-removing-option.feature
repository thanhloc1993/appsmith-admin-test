@cms
@lesson
@lesson-filter

Feature: School admin can apply and remove options to filter of future lesson
    Background:
        Given "school admin" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "school admin" has gone to "future" lessons list page

    Scenario Outline: School admin can apply more <option> filter in filter popup
        Given "school admin" has applied filter with "Lesson day of the week"
        When "school admin" applies "<option>" in filter popup
        Then "school admin" sees updated lesson list which matches lesson day of the week and "<option>"
        Examples:
            | option                                     |
            | Teacher Name                               |
            | Teacher Name, Center                       |
            | Teacher Name, Center, Student Name         |
            | Teacher Name, Center, Student Name, Course |

    Scenario Outline: School admin can remove <option> filter in filter popup
        Given "school admin" has applied filter with "Lesson day of the week","Teacher Name","Center","Student Name","Course"
        When "school admin" removes "<option>" in filter popup
        Then "school admin" sees lesson list which matches "<remained options>" without number of array
        Examples:
            | option                 | remained options                                           |
            | Lesson day of the week | Teacher Name, Center, Student Name, Course                 |
            | Teacher Name           | Lesson day of the week, Center, Student Name, Course       |
            | Center                 | Lesson day of the week, Teacher Name, Student Name, Course |
            | Student Name           | Lesson day of the week, Teacher Name, Center, Course       |
            | Course                 | Lesson day of the week, Teacher Name, Center, Student Name |

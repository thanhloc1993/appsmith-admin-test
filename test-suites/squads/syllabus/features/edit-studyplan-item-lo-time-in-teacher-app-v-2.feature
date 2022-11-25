@cms @teacher @learner
@syllabus @studyplan-item-teacher-edit-v2 @studyplan

Feature: Edit studyplan item (LO)'s time in Teacher App V2

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content have 1 quiz" book
    # "matched studyplan" = studyplan exact match with the book content

    #TCID:None
    Scenario Outline: Teacher edits time of a LO in studyplan
        Given school admin has created a matched studyplan for student with "<beforetab>" study plan items
        And student sees the LO at "<beforetab>" in Todos screen on Learner App
        When teacher edits time of LO to the "<timeline>"
        Then teacher sees the edited time of LO on Teacher App
        And school admin sees the edited time of LO on CMS
        And student sees the LO at "<aftertab>" in Todos screen on Learner App
        And student sees the edited due date of LO in Todos screen on Learner App
        And student still sees the LO in course on Learner app
        Examples:
            | beforetab | timeline | aftertab |
            | active    | past     | overdue  |
            | active    | future   | active   |
            | overdue   | past     | overdue  |
            | overdue   | future   | active   |

    #TCID:None
    Scenario Outline: Teacher edits time of a LO in studyplan - part2
        Given school admin has created a matched studyplan for student with "active" study plan items
        And student has done LO quiz
        And student sees the LO at "<beforetab>" in Todos screen on Learner App
        When teacher edits time of LO to the "<timeline>"
        Then teacher sees the edited time of LO on Teacher App
        And school admin sees the edited time of LO on CMS
        And student sees the LO at "<aftertab>" in Todos screen on Learner App
        And student sees the edited due date of LO in Todos screen on Learner App
        And student still sees the LO in course on Learner app
        Examples:
            | beforetab | timeline | aftertab  |
            | completed | past     | completed |
            | completed | future   | completed |
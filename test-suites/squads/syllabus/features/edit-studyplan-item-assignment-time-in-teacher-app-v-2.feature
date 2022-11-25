@cms @teacher @learner
@syllabus @studyplan-item-teacher-edit-v2 @studyplan

Feature: Edit studyplan item (assignment)'s time in Teacher App V2

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content without quiz" book
    # "matched studyplan" = studyplan exact match with the book content

    #TCID:None
    Scenario Outline: Teacher edits time of an assignment in studyplan
        Given school admin has created a matched studyplan for student with "<beforetab>" study plan items
        And student sees an assignment at "<beforetab>" in Todos screen on Learner App
        When teacher edits time of assignment to the "<timeline>"
        Then teacher sees the edited time of assignment on Teacher App
        And school admin sees the edited time of assignment on CMS
        And student sees the assignment at "<aftertab>" in Todos screen on Learner App
        And student sees the edited due date of assignment in Todos screen on Learner App
        And student sees the edited due date of assignment in assignment detail screen on Learner App
        And student still sees the assignment in course on Learner app
        Examples:
            | beforetab | timeline | aftertab |
            | active    | past     | overdue  |
            | active    | future   | active   |
            | overdue   | past     | overdue  |
            | overdue   | future   | active   |

    #TCID:None
    Scenario Outline: Teacher edits time of an assignment in studyplan - part 2
        Given school admin has created a matched studyplan for student with "active" study plan items
        And student has submitted assignment
        And student sees an assignment at "<beforetab>" in Todos screen on Learner App
        When teacher edits time of assignment to the "<timeline>"
        Then teacher sees the edited time of assignment on Teacher App
        And school admin sees the edited time of assignment on CMS
        And student sees the assignment at "<aftertab>" in Todos screen on Learner App
        And student sees the edited due date of assignment in Todos screen on Learner App
        And student sees the edited due date of assignment in assignment detail screen on Learner App
        And student still sees the assignment in course on Learner app
        Examples:
            | beforetab | timeline | aftertab  |
            | completed | past     | completed |
            | completed | future   | completed |
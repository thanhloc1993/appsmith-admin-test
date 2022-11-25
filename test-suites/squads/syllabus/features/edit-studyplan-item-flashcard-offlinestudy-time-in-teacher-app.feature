@cms @teacher @learner
@syllabus @studyplan @studyplan-item-teacher-edit
@ignore

Feature: Edit studyplan item (flashcard)'s time in Teacher App

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a content book
        And school admin has created a matched studyplan for student
    # "matched studyplan" = studyplan exact match with the book content

    #TCID:None
    Scenario Outline: Teacher edits time of a flashcard in studyplan
        Given student sees the "<learning objective>" at "<beforetab>" in Todos screen on Learner App
        When teacher edits time of "<learning objective>" to the "<timeline>"
        Then teacher sees the edited time of "<learning objective>" on Teacher App
        And school admin sees the edited time of "<learning objective>" when downloading studyplan on CMS
        And student sees the "<learning objective>" at "<aftertab>" in Todos screen on Learner App
        And student sees the edited due date of "<learning objective>" in Todos screen on Learner App
        And student still sees the "<learning objective>" in course on Learner app
        Examples:
            | learning objective | beforetab | timeline | aftertab  |
            | 1 of [flashcard]   | active    | past     | overdue   |
            | 1 of [flashcard]   | active    | future   | active    |
            | 1 of [flashcard]   | overdue   | past     | overdue   |
            | 1 of [flashcard]   | overdue   | future   | active    |
            | 1 of [flashcard]   | completed | past     | completed |
            | 1 of [flashcard]   | completed | future   | completed |
@cms @teacher @learner
@syllabus @studyplan-item-teacher-edit-p1 @studyplan

Feature: Edit a study plan item's time in Teacher App P1 - "empty start and due date" study plan items

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content without quiz" book
    # "matched studyplan" = studyplan exact match with the book content

    #TCID:None
    Scenario Outline: Teacher edits start and due date of a study plan item in studyplan
        Given school admin has created a matched studyplan for student with "empty start and due date" study plan items
        # study plan items are in available time
        When teacher edits "start date" of a study plan item to the "past"
        And teacher edits "due date" of a study plan item to the "<timeline>"
        Then teacher sees the edited time of a study plan item on Teacher App
        And school admin sees the edited time of a study plan item on CMS
        And student sees a study plan item at "<todo tab>" in Todos screen on Learner App
        And student sees the edited due date of a study plan item in Todos screen on Learner App
        And student sees a study plan item in course on Learner App
        Examples:
            | timeline | todo tab |
            | past     | overdue  |
            | future   | active   |

    #TCID:None
    Scenario Outline: Teacher edits start date of a study plan item in studyplan without due date
        Given school admin has created a matched studyplan for student with "empty start and due date" study plan items
        # study plan items are in available time
        When teacher edits "start date" of a study plan item to the "<timeline>"
        Then teacher sees the edited time of a study plan item on Teacher App
        And school admin sees the edited time of a study plan item on CMS
        And student "<result>" see a study plan item at "active" in Todos screen on Learner App
        And student sees a study plan item in course on Learner App
        Examples:
            | timeline | result   |
            | past     | does     |
            | future   | does not |

    #TCID:None
    Scenario Outline: Teacher edits due date of a study plan item in studyplan without start date
        Given school admin has created a matched studyplan for student with "empty start and due date" study plan items
        # study plan items are in available time
        When teacher edits "due date" of a study plan item to the "<timeline>"
        Then teacher sees the edited time of a study plan item on Teacher App
        And school admin sees the edited time of a study plan item on CMS
        And student "does not" see a study plan item at "<todo tab>" in Todos screen on Learner App
        And student sees a study plan item in course on Learner App
        Examples:
            | timeline | todo tab |
            | past     | overdue  |
            | future   | active   |
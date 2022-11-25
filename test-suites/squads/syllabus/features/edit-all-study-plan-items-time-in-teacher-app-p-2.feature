@cms @teacher @learner
@syllabus @studyplan-item-teacher-edit-p2 @studyplan

Feature: Edit all studyplan items' time in Teacher App P2 - "empty start or due date" study plan items

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content without quiz" book
    # "matched studyplan" = studyplan exact match with the book content

    #TCID:None
    Scenario Outline: Teacher edits start and due date of all study plan items in studyplan
        Given school admin has created a matched studyplan for student with "<original date>" study plan items
        # study plan items are in available time
        When teacher edits "start date" of "all" study plan items to the "past"
        And teacher edits "due date" of "all" study plan items to the "<timeline>"
        Then teacher sees the edited time of the study plan items on Teacher App
        And school admin sees the edited time of the study plan items on CMS
        And student sees the study plan items at "<todo tab>" in Todos screen on Learner App
        And student sees the edited due date of the study plan items in Todos screen on Learner App
        And student sees the study plan items in course on Learner App
        Examples:
            | original date    | timeline | todo tab |
            | empty due date   | past     | overdue  |
            | empty due date   | future   | active   |
            | empty start date | past     | overdue  |
            | empty start date | future   | active   |

    #TCID:None
    Scenario Outline: Teacher edits start date of all study plan items in studyplan without due date
        Given school admin has created a matched studyplan for student with "empty due date" study plan items
        # study plan items are in available time
        When teacher edits "start date" of "all" study plan items to the "<timeline>"
        Then teacher sees the edited time of the study plan items on Teacher App
        And school admin sees the edited time of the study plan items on CMS
        And student "<result>" see the study plan items at "active" in Todos screen on Learner App
        And student sees the study plan items in course on Learner App
        Examples:
            | timeline | result   |
            | past     | does     |
            | future   | does not |

    #TCID:None
    Scenario Outline: Teacher edits due date of all study plan items in studyplan without start date
        Given school admin has created a matched studyplan for student with "empty start date" study plan items
        # study plan items are in available time
        When teacher edits "due date" of "all" study plan items to the "<timeline>"
        Then teacher sees the edited time of the study plan items on Teacher App
        And school admin sees the edited time of the study plan items on CMS
        And student "does not" see the study plan items at "<todo tab>" in Todos screen on Learner App
        And student sees the study plan items in course on Learner App
        Examples:
            | timeline | todo tab |
            | past     | overdue  |
            | future   | active   |
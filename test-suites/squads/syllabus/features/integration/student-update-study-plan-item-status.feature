@cms
@syllabus @book @studyplan @studyplan-item-admin-edit

Feature: Show/Hide(Archived/Re-activate) student study plan items status
    Background:
        Given "school admin" logins CMS
        And school admin has created a "simple content 2 topic without quiz" book
        And school admin has created a new course without any location
        And school admin has added 2 students to the course

    #TCID:syl-0900,syl-0904
    Scenario Outline: User can <action> student study plan items
        When school admin has created a matched studyplan with "<status>" study plan items
        Then school admin goes to the "student" study plan in the course detail
        And school admin goes to the "random student" study plan detail
        And school admin does "<action>" some study plan items
        And school admin sees status study plan items updated
        And school admin sees study plan items of the other students not effect
        And school admin sees course study plan not effect

        Examples:
            | status   | action |
            | archived | show   |
            | active   | hide   |

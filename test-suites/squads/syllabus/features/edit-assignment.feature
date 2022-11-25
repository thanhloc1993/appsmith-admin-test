@cms @teacher @learner
@syllabus @assignment @assignment-common

#Edit assignment's settings will be covered in another BDD
Feature: Edit assignment

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content without quiz" book
        And school admin has created a matched studyplan for student
    # "matched studyplan" = studyplan exact match with the book content

    #TCID:syl-0070
    Scenario Outline: Student and teacher can see the edited assignment's <info> when admin edits assignment's <info>
        Given school admin is at book detail page
        When school admin edits assignment "<info>"
        Then school admin sees the edited assignment "<info>" on CMS
        And student sees the edited assignment "<info>" on Learner App
        And teacher sees the edited assignment "<info>" on Teacher App
        Examples:
            | info                |
            | name                |
            | instruction         |
            | attachments         |
            | require grading     |
            | not require grading |

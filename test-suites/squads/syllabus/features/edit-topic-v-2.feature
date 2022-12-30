@cms @teacher @learner
@syllabus @studyplan-book @studyplan

Feature: Edit topic V2

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "content without quiz" book
        And school admin has created a matched studyplan for student

    #TCID"syl-0066
    Scenario Outline: Student can see the edited topic <info> when admin edits info of a topic in the content book
        Given school admin is at book detail page
        When school admin edits topic "<info>"
        Then school admin sees the edited topic "<info>" on CMS
        And school admin is at the "master" study plan detail
        And school admin sees the edited topic on master study plan CMS
        And school admin is at the "individual" study plan detail
        And school admin sees the edited topic on individual study plan CMS
        And student sees the edited topic "<info>" on Learner App
        And teacher sees the edited topic "<info>" on Teacher App
        Examples:
            | info |
            | name |
            | icon |
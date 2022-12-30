@cms @teacher @learner
@syllabus @question
@ignore

Feature: Edit question

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And "school admin" has created a content book
        And "school admin" has created a studyplan exact match with the book content for student

    #TCID:syl-0074,syl-0075
    Scenario Outline: Student & teacher can see the edited <info> of a <type> question in LO
        Given school admin is at a LO detail page
        And school admin creates a new "<type>" question
        And school admin sees the new "<type>" question
        When school admin edits the "<info>" of "<type>" question
        Then school admin sees the edited "<info>" of "<type>" question on CMS
        And "student" sees the edited "<info>" of "<type>" question on Learner App
        And "teacher" sees the edited "<info>" of "<type>" question on Teacher App
        Examples:
            | type                                                                  | info                                                                   |
            | 1 of [multiple choice,fill in the blank,manual input,multiple answer] | 1 of [description,answers,number of answers,answer config,explanation] |

    #TCID:syl-0076
    Scenario Outline: Student & teacher can see the edited <info> of a <type> question in flashcard
        Given school admin is at a flashcard detail page
        And school admin creates a new "<type>" question
        And school admin sees the new "<type>" question
        When school admin edits the "<info>" of "<type>" question
        Then school admin sees the edited "<info>" of "<type>" question on CMS
        And "student" sees the edited "<info>" of "<type>" question on Learner App
        And "teacher" sees the edited "<info>" of "<type>" question on Teacher App
        Examples:
            | type                                     | info                          |
            | 1 of [term and definition,pair of words] | 1 of [description,definition] |

# Scenario Outline: Student and teacher can see the new question <type> when admin changes type of a question in a LO
#     Given school admin is at a LO detail page
#     And school admin creates a new "<type>" question
#     And school admin sees the new "<type>" question
#     When school admin changes type of the question
#     Then school admin sees the new type of that question on CMS
#     And "student" sees the new type of that question on Learner App
#     And "teacher" sees the new type of that question on Teacher App
#     Examples:
#         | type                                                                  |
#         | 1 of [multiple choice,fill in the blank,manual input,multiple answer] |

# Scenario Outline: Student and teacher can see the new question <typ> when admin changes type of a question in a flashcard
#     Given school admin is at a flashcard detail page
#     And school admin creates a new "<type>" question
#     And school admin sees the new "<type>" question
#     When school admin changes type of the question
#     Then school admin sees the new type of that question on CMS
#     And "student" sees the new type of that question on Learner App
#     And "teacher" sees the new type of that question on Teacher App
#     Examples:
#         | type                                     |
#         | 1 of [term and definition,pair of words] |

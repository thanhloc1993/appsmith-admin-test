@cms
@cms-syllabus-integration
@syllabus @book

Feature: [Integration] School admin deletes a topic

    Background:
        Given "school admin" logins CMS
        And school admin has created a "has chapter and topic only" book
        And school admin is at book detail page

    #TCID:syl-0035
    Scenario: School admin deletes a topic in book
        Given school admin selects a topic in book to delete
        When school admin "confirms" the deleting topic process
        Then school admin sees message "You have deleted topic successfully"
        And school admin does not see the deleted topic in book

    #TCID:syl-0861
    Scenario:  School admin cancel deleting a topic
        Given school admin selects a topic in book to delete
        When school admin "cancels" the deleting topic process
        Then school admin still sees the topic in book

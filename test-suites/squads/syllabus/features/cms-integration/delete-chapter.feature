@cms
@cms-syllabus-integration
@syllabus @book

Feature: [Integration] School admin deletes a chapter

    Background:
        Given "school admin" logins CMS
        And school admin has created a "has chapter and topic only" book
        And school admin is at book detail page

    #TCID:syl-0034
    Scenario: School admin deletes a chapter in book
        Given school admin selects a chapter in book to delete
        When school admin "confirms" the deleting chapter process
        Then school admin sees message "You have deleted chapter successfully"
        And school admin does not see the deleted chapter in book

    #TCID:syl-0860
    Scenario:  School admin cancel deleting a chapter
        Given school admin selects a chapter in book to delete
        When school admin "cancels" the deleting chapter process
        Then school admin still sees the chapter in book

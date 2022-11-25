@cms
@cms-syllabus-integration
@syllabus @book

Feature: [Integration] School admin duplicates book integration test
    Background:
        Given "school admin" logins CMS
        And school admin has created a "original content to duplicate" book
        And school admin goes to book detail page

    #TCID:syl-0086,syl-0039
    Scenario: School admin can duplicate book
        When school admin duplicates original book
        Then school admin sees message "You have duplicated book successfully"
        And school admin sees the duplicated book on CMS
        And school admin sees chapter in book same as in original book
        And school admin sees topic in each chapter same as in original book
        And school admin sees content learning in each topic same as in original book
        And school admin doesn't see any question in LO
        And school admin doesn't see any card in flashcard

@cms
@syllabus @book @book-common
@ignore

Feature: School admin duplicates book

    Background:
        Given "school admin" logins CMS
        And school admin has created a "original content" book
        # original content book = book with 2 chapter, each chapter has 2 topics
        # each topic has all types of content-learning
        # 1/4 LO has 1 question, 1/4 FC has 1 card
        # 1/4 LO has material (=video/pdf)
        # 1/4 assignment has material (=image/video/pdf)
        And school admin is at book detail page

    #TCID:syl-0039
    Scenario: School admin duplicates book
        When school admin duplicates original book
        Then school admin sees message "You have duplicated book successfully"
        And school admin sees the duplicated book on CMS
        And school admin sees chapter in book same as in original book
        And school admin sees topic in each chapter same as in original book
        And school admin sees content learning in each topic same as in original book
        And school admin sees material in each LO same as in original book
        And school admin sees material in each assignment same as in original book
        And school admin doesn't see any question in LO
        And school admin doesn't see any card in flashcard
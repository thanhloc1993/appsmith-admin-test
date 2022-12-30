@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-jump-page

Feature: All teachers interact individually with preview thumbnail
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached materials on CMS
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App
        And "teacher T1" has shared lesson's "pdf 1" on Teacher App

    Scenario: All teachers can preview pdf slide
        When "teacher T1" shows preview thumbnail
        Then "teacher T2" sees inactive Preview icon in the main bar on Teacher App

    Scenario: All teachers see the same selected thumbnail on pdf slide when select pdf slide
        Given "teacher T1, teacher T2" have shown preview thumbnail
        And "teacher T1, teacher T2" see the first pdf page is framed and displayed in the beginning of the slide
        When "teacher T1" selects second page on pdf slide
        Then "teacher T1, teacher T2" see the second pdf page is framed in the slide
        And "teacher T1, teacher T2" see active Preview icon in the main bar on Teacher App
        And "teacher T1, teacher T2" see the second page of "pdf 1" on Teacher App
        And "student" see the second page of "pdf 1" on Learner App

    Scenario: All teachers see the same selected thumbnail on pdf slide when using next page control button
        Given "teacher T1, teacher T2" have shown preview thumbnail
        When "teacher T1" goes to "the next page" by main control bar on Teacher App
        Then "teacher T1, teacher T2" see the second pdf page is framed in the slide
        And "teacher T1, teacher T2" see active Preview icon in the main bar on Teacher App
        And "teacher T1, teacher T2" see the second page of "pdf 1" on Teacher App
        And "student" see the second page of "pdf 1" on Learner App

    Scenario: All teachers see the same selected thumbnail on pdf slide when using previous page control button
        Given "teacher T1, teacher T2" have shown preview thumbnail
        And "teacher T1" has gone to "the next page" by main control bar on Teacher App
        When "teacher T1" goes to "the previous page" by main control bar on Teacher App
        Then "teacher T1, teacher T2" see the first pdf page is framed in the slide
        And "teacher T1, teacher T2" see active Preview icon in the main bar on Teacher App
        And "teacher T1, teacher T2" see the first page of "pdf 1" on Teacher App
        And "student" see the first page of "pdf 1" on Learner App

    Scenario: All teachers don't see preview thumbnail when sharing video
        Given "teacher T1, teacher T2" have shown preview thumbnail
        When "teacher T1" shares lesson's "video 1" on Teacher App
        Then "teacher T1, teacher T2" do not see pdf slide on the left side
        And "teacher T1, teacher T2" do not see Preview icon in the main bar on Teacher App

    Scenario: All teachers don't see preview thumbnail when stop sharing
        Given "teacher T1, teacher T2" have shown preview thumbnail
        When "teacher T1" stops sharing pdf on Teacher App
        Then "teacher T1, teacher T2" do not see pdf slide on the left side
        And "teacher T1, teacher T2" do not see Preview icon in the main bar on Teacher App

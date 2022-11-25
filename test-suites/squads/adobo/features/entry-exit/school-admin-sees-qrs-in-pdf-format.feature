@cms
@entry-exit @adobo
@student-entry-exit-backoffice
@generate-student-qr-pdf

Feature: School admin sees student QRs in PDF format
    Background:
        Given "school admin" logins CMS

    Scenario Outline: School admin prints <pdfType> for existing students successfully
        Given "school admin" has created "student" with "<status>" status and parent info
        And school admin selects print "<pdfType>" for created student
        Then school admin sees "<pdfType>" display in PDF format
        Examples:
            | status    | pdfType      |
            | Potential | student card |
            | Potential | qr sheet     |
            | Enrolled  | student card |
            | Enrolled  | qr sheet     |
            | LOA       | student card |
            | LOA       | qr sheet     |
            | Withdrawn | student card |
            | Withdrawn | qr sheet     |
            | Graduated | student card |
            | Graduated | qr sheet     |

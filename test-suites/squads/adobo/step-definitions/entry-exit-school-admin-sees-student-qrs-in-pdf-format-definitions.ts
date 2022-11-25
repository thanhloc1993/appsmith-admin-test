import { CMSInterface } from '@supports/app-types';

import { pdfTypeMenuTrigger } from 'test-suites/squads/adobo/common/cms-selectors/entry-exit';

export enum PdfTypes {
    QR_SHEET = 'qr sheet',
    STUDENT_CARD = 'student card',
}

export enum PdfAriaLabels {
    QR_SHEET = 'Print as QR code sheet',
    STUDENT_CARD = 'Print as Student Card',
}

export async function openStudentQrPdfInNewTab(cms: CMSInterface, pdfType: PdfTypes) {
    const pdfTypeAriaLabel =
        pdfType === PdfTypes.QR_SHEET ? PdfAriaLabels.QR_SHEET : PdfAriaLabels.STUDENT_CARD;

    await cms.instruction(`Select ${pdfTypeAriaLabel} trigger`, async function () {
        const [pdfSheetTab] = await Promise.all([
            cms.page!.context().waitForEvent('page'),
            cms.selectElementByDataTestId(pdfTypeMenuTrigger),
            cms.selectAButtonByAriaLabel(pdfTypeAriaLabel),
        ]);

        await pdfSheetTab.waitForLoadState('networkidle'); //because PDF viewer isn't loaded in headless mode. so it won't fire load or domcontentloaded event
    });
}

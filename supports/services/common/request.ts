import { keepTimeMove2AnotherTimezone, convertToServerTimezone } from './helper';
import NsCommonRequest from './request-types';
import { convertToRaw, EditorState } from 'draft-js';
import { RichText } from 'manabuf/common/v1/contents_pb';
import { Paging } from 'manabuf/common/v1/requests_pb';
import { Timestamp } from 'manabuf/google/protobuf/timestamp_pb';
import moment, { unitOfTime } from 'moment-timezone';

export const newPagingReq = (paging: NsCommonRequest.Paging) => {
    const newPagingReq = new Paging();

    newPagingReq.setLimit(paging.limit);
    newPagingReq.setOffsetInteger(paging.offsetInteger);
    newPagingReq.setOffsetString(paging.offsetString);

    return newPagingReq;
};

export function toTimestampNewProto(date: Date | string): Timestamp {
    const processingDate = date instanceof Date ? date.toISOString() : date;
    const time = new Timestamp();
    const seconds = Math.floor(moment(processingDate).valueOf() / 1000);
    time.setSeconds(seconds);
    return time;
}

export function toRichTextManabuf(editorState: EditorState, innerHTML: string): RichText {
    const richText = new RichText();

    richText.setRaw(JSON.stringify(convertToRaw(editorState.getCurrentContent())));
    richText.setRendered(innerHTML);

    return richText;
}

/**
 * Convert date to timestamp
 * @param {Object} options
 * @param {(Date|string)} options.originDate
 * @param {boolean} options.origin
 * @param {boolean} options.start
 * @param {string} options.type
 * @param {string} options.timezone
 */
export const toTimestampServerTimezone = ({
    originDate,
    timeSlice = 'no-slice',
    typeSlice = 'date',
    timezone,
}: {
    originDate: Date | string;
    timeSlice: 'start' | 'end' | 'no-slice';
    typeSlice?: unitOfTime.StartOf;
    timezone: string;
}) => {
    const clonedDate = moment(originDate instanceof Date ? originDate.toISOString() : originDate);

    if (timeSlice === 'start') {
        clonedDate.startOf(typeSlice);
    }

    if (timeSlice === 'end') {
        clonedDate.endOf(typeSlice);
    }

    const date = keepTimeMove2AnotherTimezone(clonedDate, timezone);

    const convertDate = convertToServerTimezone(date);

    return toTimestampNewProto(convertDate);
};

export const convertDateStringToTimestamp = (originDate: string, timezone: string) => {
    return originDate.includes('23:59')
        ? toTimestampServerTimezone({ originDate, timeSlice: 'end', timezone })
        : toTimestampServerTimezone({ originDate, timeSlice: 'start', timezone });
};

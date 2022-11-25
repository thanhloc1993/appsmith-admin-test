import { createFakeBrowserEnv } from '../browser/fake-browser';
// I don't know if we want to install draft-js, but for the sake of type safe =))
import { EditorState } from 'draft-js';
import * as path from 'path';

function createDraftJSHelpers() {
    const environment = createFakeBrowserEnv(path.resolve(__dirname, './draft-dependencies.html'));

    return {
        /***
         * @param content a HTML string
         * @return EditorState
         */
        async convertHTMLToEditorState(content: string): Promise<EditorState> {
            return environment.exec((window, htmlContentPassAs2ndParam: string) => {
                const { convertFromHTML, EditorState, ContentState } = window.Draft;

                const blocksFromHTML = convertFromHTML(htmlContentPassAs2ndParam);
                const state = ContentState.createFromBlockArray(
                    blocksFromHTML.contentBlocks,
                    blocksFromHTML.entityMap
                );

                return EditorState.createWithContent(state);
            }, content);
        },
    };
}

const draftJSHelpers = createDraftJSHelpers();

export default draftJSHelpers;

import { GoogleMessage } from "app/models/google-message";

export class GoogleMessageList {
    messages: [
        {
            id: string;
            threadId: string;
        }
    ];
    nextPageToken: string;
    resultSizeEstimate: number;

    constructor(obj?: any) {
        this.messages = obj && obj.messages || '';
        this.nextPageToken = obj && obj.nextPageToken || '';
        this.nextPageToken = obj && obj.resultSizeEstimate || 0;
    }
}
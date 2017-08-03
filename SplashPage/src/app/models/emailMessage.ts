export class EmailMessage {
    id: string;
    threadId: string;
    snippet?: string;
    labelIds: [
        string
    ];
    internalDate: number;
    attachments: [
        any
    ];
    headers: Object;
    textPlain: string;
    textHtml: string;

    constructor(obj?: any) {
        this.id = obj && obj.id || '';
        this.threadId = obj && obj.threadId || '';
        this.labelIds = obj && obj.labelIds || [];
        this.internalDate = obj && obj.internalDate || 0;
        this.attachments = obj && obj.attachments || [];
        this.headers = obj && obj.headers || {};
        this.textPlain = obj && obj.textPlain || '';
        this.textHtml = obj && obj.textHtml || '';
        if (obj && obj.snippet) {
            this.snippet = obj.snippet;
        }
    }
}
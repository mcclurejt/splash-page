export class GoogleMessage {
  id: string
  threadId: string
  labelIds: [
    string
  ]
  snippet: string
  historyId: number
  internalDate: number
  payload: {
    partId: string
    mimeType: string
    filename: string
    headers: [
      {
        name: string
        value: string
      }
    ]
    body: any
    parts: [
        any
    ]
  }
  sizeEstimate: number
  raw: number
}

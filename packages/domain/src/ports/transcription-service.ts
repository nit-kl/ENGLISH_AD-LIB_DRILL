export type TranscribeOptions = {
  language?: string;
  mimeType?: string;
};

export interface TranscriptionService {
  transcribe(audioBytes: Uint8Array, options?: TranscribeOptions): Promise<string>;
}

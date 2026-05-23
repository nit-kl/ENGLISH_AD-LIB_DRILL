export class EmptyAnswerError extends Error {
  constructor() {
    super("Answer text must not be empty");
    this.name = "EmptyAnswerError";
  }
}

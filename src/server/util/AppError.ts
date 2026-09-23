export class AppError extends Error {
  status: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = this.constructor.name
    this.status = status ?? 500
  }

  toJSON() {
    return {
      error: this.message,
    }
  }
}

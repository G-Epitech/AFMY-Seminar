export class FieldsError {
  [key: string]: string;

  constructor(errors: { [key: string]: string } = {}) {
    Object.assign(this, errors);
  }

  static aggregate<K extends object>(
    errors: FieldsError,
    transformer?: (k: string, v: string) => K | null,
  ): K {
    const acc = {} as K;

    for (const key in errors) {
      acc[key] = transformer ? transformer(key, errors[key]) : errors[key];
    }
    return acc;
  }

  static fromArray<T extends object>(
    errors: T[],
    transformer: (error: T) => { key: string; value: string },
  ): FieldsError {
    const fieldsError = new FieldsError();

    for (const error of errors) {
      const { key, value } = transformer(error);
      fieldsError[key] = value;
    }
    return fieldsError;
  }
}

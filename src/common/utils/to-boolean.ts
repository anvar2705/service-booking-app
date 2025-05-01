import { Transform, TransformFnParams } from 'class-transformer';

export function ToBoolean() {
    return Transform(({ obj, key }: TransformFnParams) =>
        obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key],
    );
}

import {
    BadRequestException,
    ValidationError,
    ValidationPipeOptions,
} from '@nestjs/common';

function generateErrors(errors: ValidationError[]) {
    return errors.reduce(
        (accumulator, currentValue) => ({
            ...accumulator,
            [currentValue.property]:
                (currentValue.children?.length ?? 0) > 0
                    ? generateErrors(currentValue.children ?? [])
                    : Object.values(currentValue.constraints ?? {}).join(', '),
        }),
        {},
    );
}

const validationOptions: ValidationPipeOptions = {
    transform: true,
    whitelist: true,
    //errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException(
          Object.values(errors[0].constraints).toString(),
        );
    },
};

export default validationOptions;

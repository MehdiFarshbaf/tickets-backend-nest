import {NestFactory, Reflector} from '@nestjs/core';
import {AppModule} from './app.module';
import {JwtAuthGuard} from "./auth/guards/jwt-auth.guard";
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Global Exception Filter
    // app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(new ValidationPipe({whitelist: true, transform: true}));
    // app.useGlobalPipes(
    //     new ValidationPipe({
    //       transform: true, // Automatically transforms payload to DTO instance
    //       whitelist: true, // Strips properties that are NOT defined in the DTO
    //       // forbidNonWhitelisted: true,      // ← Remove or set to false (this is the key!)
    //       forbidNonWhitelisted: false, // Allows extra fields without throwing error
    //
    //       exceptionFactory: (errors) => {
    //         // This factory only runs when there are real validation errors
    //         // (e.g. @IsEmail(), @IsString(), etc.)
    //         // Since forbidNonWhitelisted is false, "property should not exist" errors won't appear here
    //         const result = errors.reduce(
    //             (acc, error) => {
    //               acc[error.property] = Object.values(error.constraints || {});
    //               return acc;
    //             },
    //             {} as Record<string, string[]>,
    //         );
    //
    //         return new BadRequestException({
    //           errorCode: 'VALIDATION_ERROR',
    //           message: 'داده‌های ورودی معتبر نیستند',
    //           errors: result,
    //         });
    //       },
    //     }),
    // );

    app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

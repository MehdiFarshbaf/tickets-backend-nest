import {Module} from '@nestjs/common';
import {PrismaService} from './prisma/prisma.service';
import {TicketsModule} from './tickets/tickets.module';
import {ConfigModule} from "@nestjs/config";
import { AuthModule } from './auth/auth.module';


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TicketsModule,
        AuthModule,
    ],
    controllers: [],
    providers: [PrismaService],
})
export class AppModule {
}

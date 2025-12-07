import {Module} from '@nestjs/common';
import {PrismaService} from './prisma/prisma.service';
import {TicketsModule} from './tickets/tickets.module';
import {ConfigModule} from "@nestjs/config";


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TicketsModule,
    ],
    controllers: [],
    providers: [PrismaService],
})
export class AppModule {
}

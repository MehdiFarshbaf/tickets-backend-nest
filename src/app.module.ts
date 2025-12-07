import {Module} from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { TicketsModule } from './tickets/tickets.module';


@Module({
    imports: [TicketsModule],
    controllers: [],
    providers: [PrismaService],
})
export class AppModule {
}

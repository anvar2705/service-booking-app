import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigEnum } from 'common';
import { IamModule } from 'models/iam/iam.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User], ConfigEnum.DB_CONNECTION_NAME),
        forwardRef(() => IamModule),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}

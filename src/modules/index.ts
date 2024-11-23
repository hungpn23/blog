import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [UserModule, AuthModule],
})
export class Modules {}

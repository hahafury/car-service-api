import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATABASE_CONFIG } from '@app/common/config';
import { UserModule } from '@app/modules';

@Module({
  imports: [TypeOrmModule.forRoot(DATABASE_CONFIG), UserModule],
})
export class AppModule {}

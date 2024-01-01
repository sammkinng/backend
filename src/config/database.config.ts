import { TypeOrmModuleOptions } from "@nestjs/typeorm"

const config : TypeOrmModuleOptions={
    type: 'postgres',
    url:process.env.POSTGRES_URL,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
};

export default config;

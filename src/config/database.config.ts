import { TypeOrmModuleOptions } from "@nestjs/typeorm"

const config: TypeOrmModuleOptions = {
    type: 'postgres',
    url: process.env.POSTGRES_URL,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    ssl: true, // Enable SSL
    extra: {
        sslmode: 'require', // Use `sslmode=require` to address the SSL issue
    },
};

export default config;

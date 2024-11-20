module.exports = {
    type: 'postgres', // Chọn DB bạn sử dụng
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: '123456',
    database: 'nestjs-api-app',
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
    cli: {
      migrationsDir: 'src/migrations',
    },
  };
  
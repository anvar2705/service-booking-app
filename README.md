# NEST-AUTH

Бекэнд приложение для аутентификации и авторизации. (Не забудь поставить звезду!)

## Установка

-

## Запуск приложения

-

## Документация Swagger

### localhost:5000/api/docs

## Примечание

С помощью миграций, создаются стандартные роли (USER, ADMIN) и пользователь с правами
админа (username: "admin", password: "123456789"). Все роуты, кроме роутов логина или регистрации,
защищены авторизацией по роли админа.

## Migrations

Generate initial migration

```bash
npm run migration:generate src/db/migrations/Initial
```

Create empty migration

```bash
npm run migration:create src/db/migrations/MigrationName
```

Run migration

```bash
npm run migration:run
```

# Используем официальный образ Bun
FROM oven/bun:latest

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и bun.lockb
COPY package.json bun.lockb ./

# Устанавливаем зависимости
RUN bun install

# Копируем остальной код
COPY . .

# Устанавливаем переменные окружения
ENV NODE_ENV=production

# Указываем команду запуска бота
CMD ["bun", "index.ts"]

export const dictionary = {
    en: {
        commands: {
            start: "Start the bot and see available commands",
            image: "Generate an image based on your description",
            status: "Check the status of an image generation task"
        },
        welcome: {
            greeting: "👋 Hello {name}! Welcome to the AI Image Generation Bot!",
            commands: "Available commands:\n\n{commands}"
        },
        errors: {
            unknownCommand: "Unknown command: {command}",
            unknownMessage: "Sorry, I don't understand that message.",
            unauthorized: "Sorry, this is a personal bot and is not available for public use."
        },
        image: {
            noPrompt: "Please provide a prompt after the /image command. The prompt must be in English.",
            generating: "🎨 Generating {count} image(s)...",
            taskCreated: "✨ Image generation task created!\n\nID: {id}\nStatus: {status}\nPrompt: {prompt}\n\nCheck status with /status {id}",
            error: "❌ Sorry, there was an error generating your image. Please try again later.",
            generated: "🎨 Generated from prompt:\n{prompt}\n\n🔗 Download link: {link}"
        },
        status: {
            noId: "Please provide a task ID after the /status command",
            notFound: "Task not found. Please check the ID and try again.",
            current: "🎨 Task Status\n\nID: {id}\nStatus: {status}\nPrompt: {prompt}\nCreated: {createdAt}",
            checkButton: "📊 Check Status"
        }
    },
    ru: {
        commands: {
            start: "Запустить бота и посмотреть доступные команды",
            image: "Сгенерировать изображение по вашему описанию",
            status: "Проверить статус задачи генерации изображения"
        },
        welcome: {
            greeting: "👋 Привет, {name}! Добро пожаловать в бота для генерации изображений!",
            commands: "Доступные команды:\n\n{commands}"
        },
        errors: {
            unknownCommand: "Неизвестная команда: {command}",
            unknownMessage: "Извините, я не понимаю это сообщение.",
            unauthorized: "Извините, это личный бот и не доступен для публичного использования."
        },
        image: {
            noPrompt: "Пожалуйста, добавьте описание изображения после команды /image. Описание должно быть на английском языке.",
            generating: "🎨 Генерирую {count} изображение(й)...",
            taskCreated: "✨ Задача на генерацию изображения создана!\n\nID: {id}\nСтатус: {status}\nОписание: {prompt}\n\nПроверить статус: /status {id}",
            error: "❌ Извините, произошла ошибка при генерации изображения. Пожалуйста, попробуйте позже.",
            generated: "🎨 Сгенерировано по описанию:\n{prompt}\n\n🔗 Ссылка для скачивания: {link}"
        },
        status: {
            noId: "Пожалуйста, укажите ID задачи после команды /status",
            notFound: "Задача не найдена. Пожалуйста, проверьте ID и попробуйте снова.",
            current: "🎨 Статус задачи\n\nID: {id}\nСтатус: {status}\nОписание: {prompt}\nСоздано: {createdAt}",
            checkButton: "📊 Проверить статус"
        }
    }
};
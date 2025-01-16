export const dictionary = {
    en: {
        commands: {
            start: "Start the bot and see available commands",
            image: "Generate an image based on your description"
        },
        welcome: {
            greeting: "👋 Hello {name}! Welcome to the AI Image Generation Bot!",
            commands: "Available commands:\n\n{commands}"
        },
        errors: {
            unknownCommand: "Unknown command: {command}",
            unknownMessage: "Sorry, I don't understand that message."
        },
        image: {
            noPrompt: "Please provide a prompt after the /image command. The prompt must be in English.",
            generating: "🎨 Generating {count} image(s)...",
            taskCreated: "✨ Image generation task created!\n\nID: {id}\nStatus: {status}\nPrompt: {prompt}",
            error: "❌ Sorry, there was an error generating your image. Please try again later."
        }
    },
    ru: {
        commands: {
            start: "Запустить бота и посмотреть доступные команды",
            image: "Сгенерировать изображение по вашему описанию"
        },
        welcome: {
            greeting: "👋 Привет, {name}! Добро пожаловать в бота для генерации изображений!",
            commands: "Доступные команды:\n\n{commands}"
        },
        errors: {
            unknownCommand: "Неизвестная команда: {command}",
            unknownMessage: "Извините, я не понимаю это сообщение."
        },
        image: {
            noPrompt: "Пожалуйста, добавьте описание изображения после команды /image. Описание должно быть на английском языке.",
            generating: "🎨 Генерирую {count} изображение(й)...",
            taskCreated: "✨ Задача на генерацию изображения создана!\n\nID: {id}\nСтатус: {status}\nОписание: {prompt}",
            error: "❌ Извините, произошла ошибка при генерации изображения. Пожалуйста, попробуйте позже."
        }
    }
};
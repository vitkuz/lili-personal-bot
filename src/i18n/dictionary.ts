export const dictionary = {
    en: {
        welcome: {
            message0: 'Welcome to the bot!',
            message1: 'Available commands:\n\n/start - Start the bot\n/image <prompt> - Generate an image based on your description',
            message2: 'Now go to the website (use the link above), create filters, and enable notifications.',
            message3: 'The bot will send relevant job offers directly to your Telegram based on the filters you created.',
            message4: 'You pay 1 Telegram star ($0.016) for each match (notification). No matches — no payment.',
            message5: 'You have a starting balance of 10 stars to test everything.',
            message6: 'Questions or suggestions? Contact @siberian_lily',
        },
        about: {
            about0: "👋 My name is Lilia, and I’ve been living and working in different countries for 9 years. I have experience working on contracts in Asia and the Middle East. With my help, you’ll gain access to unique job opportunities and support at every step.\n\n",
            about1: "I’m an independent recruiter helping people find jobs in Asia, leave cold and depressive regions of Russia, and start earning in dollars.\n\n If someone secures a job through me and passes the probation period, I receive a reward for filling the vacancy.\n\n To simplify the process of finding new opportunities for more people, I created a Telegram bot that automatically scans 5 of the most popular job sites, finds new offers, checks them against customized filters for each user, and sends notifications if a match is found.\n\n This bot is now available to everyone.\n\n Use this bot to automatically search for the perfect job in Asia. Save time and stay up-to-date with the latest opportunities.",
            about2: "⭐️ Why choose me? I guarantee reliability, transparency, and a personalized approach for every candidate. Travel and earn more than in your hometown!",
            about3: "👉 Follow me on social media to stay updated with all the latest news 🚨, hot jobs 🔥, and travel stories! 🌏✈️",
            social: {
                instagram: "My Instagram",
                telegram: "My Telegram",
                jobs: "My Job Listings",
                worldwide: "Latest Jobs in Asia",
                website: "My Website"
            }
        },
        balance: {
            current: "💰 {firstName}, your current balance is ⭐{balance}",
            error: "❌ Sorry, I could not fetch your balance. Please try again later."
        },
        auth: {
            loginLink: "Here's your login link:\n\n{link}"
        },
        payment: {
            title: "Top Up Balance",
            description: "Add 1 ⭐ star ($0.016) to balance",
            error: "❌ Sorry, there was an error creating the payment. Please try again later.",
            success: "✅ Payment successful! Added ⭐{amount} to your balance.",
            updateError: "❌ Payment received but failed to update balance. Our team will resolve this issue."
        },
        errors: {
            unknownCommand: "Unknown command: {command}",
            unknownMessage: "Sorry, I don't understand that message."
        },
        image: {
            noPrompt: "Please provide a prompt after the /image command",
            generating: "🎨 Generating your image...",
            taskCreated: "✨ Image generation task created!\n\nID: {id}\nStatus: {status}",
            error: "❌ Sorry, there was an error generating your image. Please try again later."
        }
    },
    ru: {
        welcome: {
            message0: 'Добро пожаловать в бот!',
            message1: 'Доступные команды:\n\n/start - Запустить бота\n/image <описание> - Сгенерировать изображение по вашему описанию',
            message2: 'Теперь перейдите на сайт (используйте ссылку выше), создайте фильтры и включите уведомления.',
            message3: 'Бот будет отправлять подходящие вакансии на основе созданных вами фильтров прямо в Telegram.',
            message4: 'Вы платите 1 Telegram звезду ($0.016) за каждое совпадение (уведомление). Нет совпадений — нет оплаты.',
            message5: 'У вас есть стартовый баланс в 10 звёзд, чтобы вы могли всё протестировать.',
            message6: 'Вопросы или предложения? Свяжитесь с @siberian_lily',
        },
        about: {
            about0: "👋 Меня зовут Лиля, и я уже 9 лет живу и работаю в разных странах. У меня есть опыт работы по контрактам в Азии и на Ближнем Востоке. С помощью меня вы получите доступ к уникальным вакансиям и поддержку на каждом этапе.\n\n",
            about2: "⭐️ Почему выбрать меня? Я гарантирую надежность, прозрачность и индивидуальный подход к каждому кандидату. Путешествуйте и зарабатывайте больше, чем в вашем городе!",
            about1: "Я независимый рекрутер и помогаю людям найти работу в Азии, уехать из депрессивных и холодных регионов России и начать зарабатывать в долларах.\n\n Если человек уехал благодаря мне и прошел испытательный срок, я получаю вознаграждение за закрытую вакансию.\n\n Чтобы упростить процесс поиска новых возможностей для большего количества людей, я создала Telegram-бота, который автоматически сканирует 5 самых популярных сайтов с вакансиями, находит новые предложения, проверяет их на совпадения с настроенными фильтрами для каждого человека и отправляет уведомления, если совпадение найдено. \n\n Теперь этот бот доступен каждому. \n\n Используй этого бота для автоматического поиска идеального места работы в Азии. Экономь время и держи руку на пульсе",
            about3: "👉 Подписывайтесь на меня в социальных сетях и будьте в курсе всех новостей 🚨, горячих вакансий 🔥 и историй о путешествиях! 🌏✈️",
            social: {
                instagram: "Мой Instagram",
                telegram: "Мой Telegram",
                jobs: "Мои вакансии",
                worldwide: "Свежие вакансии в Азии",
                website: "Мой сайт"
            }
        },
        balance: {
            current: "💰 {firstName}, ваш текущий баланс ⭐{balance}",
            error: "❌ Извините, не удалось получить ваш баланс. Пожалуйста, попробуйте позже."
        },
        auth: {
            loginLink: "Вот ваша ссылка для входа:\n\n{link}"
        },
        payment: {
            title: "Пополнить баланс",
            description: "Добавить 1 ⭐ звезду ($0.016) на баланс",
            error: "❌ Извините, произошла ошибка при создании платежа. Пожалуйста, попробуйте позже.",
            success: "✅ Платеж успешен! Добавлено ⭐{amount} на ваш баланс.",
            updateError: "❌ Платеж получен, но не удалось обновить баланс. Наша команда решит эту проблему."
        },
        errors: {
            unknownCommand: "Неизвестная команда: {command}",
            unknownMessage: "Извините, я не понимаю это сообщение."
        },
        image: {
            noPrompt: "Пожалуйста, добавьте описание изображения после команды /image",
            generating: "🎨 Генерирую изображение...",
            taskCreated: "✨ Задача на генерацию изображения создана!\n\nID: {id}\nСтатус: {status}",
            error: "❌ Извините, произошла ошибка при генерации изображения. Пожалуйста, попробуйте позже."
        }
    }
};
export enum BotCommands {
    START = '/start',
    IMAGE = '/image'
}

export enum ApiEndpoints {
    IMAGE_GENERATION = 'https://j9y3r5j656.execute-api.us-east-1.amazonaws.com/prod/'
}

export const ImageGenerationDefaults = {
    VERSION: '70a95a700a394552368f765fee2e22aa77d6addb933ba3ad914683c5e11940e1',
    MODEL: 'dev',
    MEGAPIXELS: '1',
    NUM_OUTPUTS: 4,
    ASPECT_RATIO: '1:1',
    OUTPUT_FORMAT: 'jpg',
    GUIDANCE_SCALE: 3,
    OUTPUT_QUALITY: 80,
    PROMPT_STRENGTH: 0.8,
    LORA_SCALE: 1,
    EXTRA_LORA_SCALE: 1,
    NUM_INFERENCE_STEPS: 28
}

export enum DefaultLanguage {
    CODE = 'ru'
}
import axios from 'axios';
import { ImageGenerationResponse } from './types';
import { logger } from '../../utils/logger';
import { ApiEndpoints } from '../../constants/bot';

export async function generateImage(prompt: string){
    const request = {
        "taskType": "replicate:images",
        "input": {
            "version": "vitkuz/lily-new-photos:0c6c34796d96cab58e402583cbed80fd6cffb16328de842265ac8ad727854f66",
            "input": {
                "model": "dev",
                "go_fast": false,
                "lora_scale": 1,
                "megapixels": "1",
                "num_outputs": 2,
                "aspect_ratio": "9:16",
                "output_format": "jpg",
                "guidance_scale": 3,
                "output_quality": 100,
                "prompt_strength": 0.8,
                "extra_lora_scale": 1,
                "num_inference_steps": 28,
                prompt
            }
        }
    };

    try {
        const response = await axios.post<ImageGenerationResponse>(ApiEndpoints.IMAGE_GENERATION, request, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        logger.debug('Image generation response', response.data);
        return response.data.data;
    } catch (error) {
        logger.error('Failed to generate image', error as Error);
        throw new Error('Failed to generate image');
    }
}

export async function generateVideo(prompt: string){
    const request = {
        "taskType": "replicate:videos",
        "input": {
            "version": "minimax/video-01",
            "input": {
                prompt,
                "prompt_optimizer": true
            }
        }
    };

    try {
        const response = await axios.post<ImageGenerationResponse>(ApiEndpoints.IMAGE_GENERATION, request, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        logger.debug('Image generation response', response.data);
        return response.data.data;
    } catch (error) {
        logger.error('Failed to generate image', error as Error);
        throw new Error('Failed to generate image');
    }
}
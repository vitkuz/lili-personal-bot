import axios from 'axios';
import { ImageGenerationResponse } from './types';
import { logger } from '../../utils/logger';
import { ApiEndpoints, ImageGenerationDefaults } from '../../constants/bot';

export async function generateImage(prompt: string): Promise<ImageGenerationResponse> {
    const request = {
        version: ImageGenerationDefaults.VERSION,
        input: {
            model: ImageGenerationDefaults.MODEL,
            prompt,
            go_fast: false,
            lora_scale: ImageGenerationDefaults.LORA_SCALE,
            megapixels: ImageGenerationDefaults.MEGAPIXELS,
            num_outputs: ImageGenerationDefaults.NUM_OUTPUTS,
            aspect_ratio: ImageGenerationDefaults.ASPECT_RATIO,
            output_format: ImageGenerationDefaults.OUTPUT_FORMAT,
            guidance_scale: ImageGenerationDefaults.GUIDANCE_SCALE,
            output_quality: ImageGenerationDefaults.OUTPUT_QUALITY,
            prompt_strength: ImageGenerationDefaults.PROMPT_STRENGTH,
            extra_lora_scale: ImageGenerationDefaults.EXTRA_LORA_SCALE,
            num_inference_steps: ImageGenerationDefaults.NUM_INFERENCE_STEPS
        }
    };

    try {
        const response = await axios.post<ImageGenerationResponse>(ApiEndpoints.IMAGE_GENERATION, request, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        logger.debug('Image generation response', response.data);
        return response.data;
    } catch (error) {
        logger.error('Failed to generate image', error as Error);
        throw new Error('Failed to generate image');
    }
}
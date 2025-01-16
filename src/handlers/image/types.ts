// export interface ImageGenerationRequest {
//     version: string;
//     input: {
//         model: string;
//         prompt: string;
//         go_fast: boolean;
//         lora_scale: number;
//         megapixels: string;
//         num_outputs: number;
//         aspect_ratio: string;
//         output_format: string;
//         guidance_scale: number;
//         output_quality: number;
//         prompt_strength: number;
//         extra_lora_scale: number;
//         num_inference_steps: number;
//     };
// }

export interface ImageGenerationResponse {
    id: string;
    status: string;
    output?: string[]
}
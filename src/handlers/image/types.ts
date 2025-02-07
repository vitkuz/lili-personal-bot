export interface ImageGenerationResponse {
    data: {
        id: string;
        status: string;
        output?: string[]
    }
}
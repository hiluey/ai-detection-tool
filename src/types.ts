export interface DetectAIResponse {
    id: string;
    result: number;
    result_details: {
      aiPercentage: number;
      humanPercentage: number;
    };
  }
  
  export interface QueryDetectionResponse {
    id: string;
    userkey: string | null;
    model: string;
    result: {
      ai_score: number;
      human_score: number;
    } | null; // Se for nulo, significa que a detecção não foi concluída ainda.
    result_details: {
      aiPercentage?: number;
      humanPercentage?: number;
      human_score?: number;
    };
    status: string; // Certifique-se de que o status esteja sempre presente
  }
  
  
  export interface DetectionResult {
    aiPercentage: number;
    humanPercentage: number;
    aiLikely: string;
    humanLikely: string;
  }
  
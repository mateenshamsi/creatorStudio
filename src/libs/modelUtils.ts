import { ModelMetadata, ModelCategory } from "@/types/model";

/**
 * Groups models by category for UI display
 */
export const groupModelsByCategory = (models: ModelMetadata[]) => {
  return models.reduce((acc, model) => {
    if (!acc[model.category]) acc[model.category] = [];
    acc[model.category].push(model);
    return acc;
  }, {} as Record<ModelCategory, ModelMetadata[]>);
};

/**
 * Filters models supporting file uploads (for audio/image features)
 */
export const getFileUploadModels = (models: ModelMetadata[]) => {
  return models.filter(m => m.supportsFileUpload);
};
import { ComplianceService } from '../services/compliance.service';
export declare class ComplianceController {
    private readonly complianceService;
    constructor(complianceService: ComplianceService);
    validateLabelCompliance(labelId: number): Promise<{
        labelId: number;
        isCompliant: boolean;
        validatedAt: string;
        checks: {
            requirement: string;
            status: string;
            description: string;
        }[];
        score: number;
        recommendations: string[];
    }>;
    getComplianceRequirements(): Promise<{
        categories: {
            name: string;
            requirements: string[];
        }[];
        lastUpdated: string;
    }>;
    getNutritionTemplate(): Promise<{
        templateId: string;
        name: string;
        description: string;
        version: string;
        requiredFields: string[];
        optionalFields: string[];
        formatting: {
            fontSize: {
                title: number;
                serving: number;
                calories: number;
                nutrients: number;
                footnote: number;
            };
            margins: {
                top: number;
                bottom: number;
                left: number;
                right: number;
            };
            borders: boolean;
            backgroundColor: string;
        };
    }>;
    checkAllergenCompliance(data: {
        productId: number;
        allergens: string[];
    }): Promise<{
        productId: number;
        allergens: string[];
        invalidAllergens: string[];
        isCompliant: boolean;
        requirements: {
            mustBeBold: boolean;
            mustBeAfterIngredients: boolean;
            mustUseExactTerms: boolean;
            mustIncludeContainsStatement: boolean;
        };
        suggestedText: string;
        checkedAt: string;
    }>;
    getCertifications(): Promise<{
        id: string;
        name: string;
        authority: string;
        description: string;
        logo: string;
        requirements: string[];
    }[]>;
    getComplianceStats(): Promise<{
        overview: {
            totalLabelsChecked: number;
            compliantLabels: number;
            nonCompliantLabels: number;
            complianceRate: number;
        };
        byCategory: {
            foodSafety: {
                checked: number;
                compliant: number;
                rate: number;
            };
            organicCertification: {
                checked: number;
                compliant: number;
                rate: number;
            };
            allergenDeclaration: {
                checked: number;
                compliant: number;
                rate: number;
            };
            nutritionFacts: {
                checked: number;
                compliant: number;
                rate: number;
            };
        };
        commonIssues: {
            issue: string;
            frequency: number;
            severity: string;
        }[];
        trends: {
            improvementRate: number;
            avgResolutionTime: string;
            repeatViolations: number;
        };
    }>;
}

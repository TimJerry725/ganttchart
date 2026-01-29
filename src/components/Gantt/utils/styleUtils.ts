import type { GanttStyleConfig } from '../types';

/**
 * Applies style configuration to create inline styles for components
 */
export const applyStyleConfig = (styleConfig?: Partial<GanttStyleConfig>) => {
    if (!styleConfig) return {};

    return {
        // Popover styles
        popover: {
            backgroundColor: styleConfig.popoverBackground || '#fff',
            borderColor: styleConfig.popoverBorderColor || '#f0f0f0',
            borderRadius: styleConfig.popoverBorderRadius || '8px',
            boxShadow: styleConfig.popoverShadow || '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
            padding: styleConfig.popoverPadding || '0',
            fontFamily: styleConfig.popoverFontFamily || styleConfig.fontFamily || 'inherit',
            fontSize: styleConfig.popoverFontSize || styleConfig.fontSize || '14px',
        },

        // Modal styles
        modal: {
            backgroundColor: styleConfig.modalBackground || '#fff',
            borderRadius: styleConfig.modalBorderRadius || '8px',
            borderColor: styleConfig.modalBorderColor || '#f0f0f0',
            boxShadow: styleConfig.modalShadow || '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
        },

        // Button styles
        buttonPrimary: {
            backgroundColor: styleConfig.buttonPrimaryBackground || '#1677ff',
            color: styleConfig.buttonPrimaryColor || '#fff',
            borderRadius: styleConfig.buttonPrimaryBorderRadius || '6px',
            fontWeight: styleConfig.buttonPrimaryFontWeight || 400,
            fontFamily: styleConfig.buttonPrimaryFontFamily || styleConfig.fontFamily || 'inherit',
            boxShadow: '0 2px 0 rgba(5, 145, 255, 0.1)',
        },

        buttonDanger: {
            backgroundColor: styleConfig.buttonDangerBackground || '#ff4d4f',
            color: styleConfig.buttonDangerColor || '#fff',
            borderRadius: styleConfig.buttonPrimaryBorderRadius || '6px',
            boxShadow: '0 2px 0 rgba(255, 38, 5, 0.06)',
        },

        buttonSecondary: {
            backgroundColor: styleConfig.buttonSecondaryBackground || 'transparent',
            color: styleConfig.buttonSecondaryColor || 'rgba(0, 0, 0, 0.88)',
            borderColor: styleConfig.buttonSecondaryBorderColor || '#d9d9d9',
            borderRadius: styleConfig.buttonPrimaryBorderRadius || '6px',
            boxShadow: '0 2px 0 rgba(0, 0, 0, 0.02)',
        },

        // Input styles - Cleaned up to avoid breaking Ant Design internals
        input: {
            backgroundColor: styleConfig.inputBackground,
            borderColor: styleConfig.inputBorderColor,
            borderRadius: styleConfig.inputBorderRadius || '6px',
            fontFamily: styleConfig.inputFontFamily || styleConfig.fontFamily || 'inherit',
            fontSize: styleConfig.inputFontSize || styleConfig.fontSize || '14px',
        },

        // List item styles
        listItem: {
            hoverBackground: styleConfig.listItemHoverBackground || '#f5f5f5',
            selectedBackground: styleConfig.listItemSelectedBackground || '#e6f4ff',
            borderColor: styleConfig.listItemBorderColor || '#f0f0f0',
        },

        // Badge styles
        badge: {
            backgroundColor: styleConfig.badgeBackground || '#e6f4ff',
            borderColor: styleConfig.badgeBorderColor || 'transparent',
            color: styleConfig.badgeColor || '#1677ff',
            fontSize: styleConfig.badgeFontSize || '12px',
            padding: styleConfig.badgePadding || '0 7px',
            borderRadius: styleConfig.badgeBorderRadius || '10px',
        },

        // Link styles
        link: {
            color: styleConfig.linkColor || '#1677ff',
            hoverColor: styleConfig.linkHoverColor || '#69b1ff',
            fontWeight: styleConfig.linkFontWeight || 400,
        },

        // General font
        font: {
            fontFamily: styleConfig.fontFamily || 'inherit',
            fontSize: styleConfig.fontSize || '14px',
            fontWeight: styleConfig.fontWeight || 400,
            lineHeight: styleConfig.lineHeight || 1.5714285714285714,
            color: styleConfig.fontColor || 'rgba(0, 0, 0, 0.88)',
        },
    };
};

/**
 * Generates CSS variables from style config for use in CSS
 */
export const generateCSSVariables = (styleConfig?: Partial<GanttStyleConfig>): Record<string, string> => {
    if (!styleConfig) return {};

    const variables: Record<string, string> = {};

    // Map style config to CSS variables
    if (styleConfig.primary) variables['--gantt-primary'] = styleConfig.primary;
    if (styleConfig.fontFamily) variables['--gantt-font-family'] = styleConfig.fontFamily;
    if (styleConfig.fontSize) variables['--gantt-font-size'] = styleConfig.fontSize;
    if (styleConfig.popoverBackground) variables['--gantt-popover-bg'] = styleConfig.popoverBackground;
    if (styleConfig.buttonPrimaryBackground) variables['--gantt-button-primary-bg'] = styleConfig.buttonPrimaryBackground;
    if (styleConfig.linkColor) variables['--gantt-link-color'] = styleConfig.linkColor;

    // Add custom CSS variables
    if (styleConfig.customCSSVariables) {
        Object.assign(variables, styleConfig.customCSSVariables);
    }

    return variables;
};

/**
 * Transforms endpoint names from widget format to API route format
 * 
 * Examples:
 * - "get_g2p_geo_level_values" -> "geo_level_values"
 * - "get_g2p_geo_levels" -> "geo_levels"
 * - "get_all_partners" -> "all_partners"
 * 
 * Note: Keeps snake_case format to match existing API route naming convention
 */
export function transformEndpointName(endpoint: string): string {
    // Remove common prefixes like "get_", "post_", "put_", "delete_"
    let transformed = endpoint.replace(/^(get_|post_|put_|delete_|patch_)/i, '');

    // Remove "g2p_" prefix if present
    transformed = transformed.replace(/^g2p_/, '');

    // Keep snake_case format (don't convert to kebab-case)
    // Existing routes use snake_case: geo_level_values, geo_levels

    return transformed;
}

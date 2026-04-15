<?php
if (!defined('ABSPATH')) {
    exit;
}

function hm_get_array_meta($post_id, $key) {
    $value = get_post_meta($post_id, $key, true);
    if (is_array($value)) {
        return $value;
    }

    if (is_string($value) && $value !== '') {
        $decoded = json_decode($value, true);
        if (is_array($decoded)) {
            return $decoded;
        }
    }

    return [];
}

/**
 * Get hero image with fallback for broken placeholders
 */
function hm_get_hero_image_fallback($image_url) {
    $working_link = 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/Untitled-28.png';
    if (empty($image_url) || !is_string($image_url)) {
        return $working_link;
    }
    if (strpos($image_url, 'placeholder-travel.svg') !== false) {
        return $working_link;
    }
    return $image_url;
}

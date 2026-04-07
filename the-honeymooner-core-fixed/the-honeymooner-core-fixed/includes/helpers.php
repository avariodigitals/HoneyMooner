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

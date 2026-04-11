<?php

if (!defined('ABSPATH')) exit;

class HM_REST {

    public static function init() {
        add_action('rest_api_init', [self::class, 'register_routes']);
        add_action('rest_api_init', [self::class, 'register_rest_fields']);
    }

    public static function register_routes(): void {
        register_rest_route('honeymooner/v1', '/leads', [
            'methods' => ['POST', 'GET'],
            'callback' => function (WP_REST_Request $request) {
                if ($request->get_method() === 'POST') {
                    return self::submit_lead($request);
                } else {
                    return self::get_leads($request);
                }
            },
            'permission_callback' => function () {
                return current_user_can('manage_options'); // Only admins can GET leads
            },
        ]);
    }

    public static function get_leads(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        $table = HM_Leads_DB::table_name();
        $results = $wpdb->get_results("SELECT * FROM $table ORDER BY id DESC LIMIT 100", ARRAY_A);
        return new WP_REST_Response($results, 200);
    }

    public static function submit_lead(WP_REST_Request $request): WP_REST_Response {
        $email = sanitize_email((string) $request->get_param('email'));
        $traveler_name = sanitize_text_field((string) $request->get_param('traveler_name'));
        $phone = sanitize_text_field((string) $request->get_param('phone'));
        $package_name = sanitize_text_field((string) $request->get_param('package_name'));
        if (!$email || !is_email($email) || $traveler_name === '' || $phone === '' || $package_name === '') {
            return new WP_REST_Response(['success' => false, 'message' => 'Package, name, email, and phone are required.'], 422);
        }

        $lead_id = HM_Leads_DB::insert([
            'package_id' => $request->get_param('package_id'),
            'package_name' => $package_name,
            'package_tier' => $request->get_param('package_tier'),
            'departure_date' => $request->get_param('departure_date'),
            'adults' => $request->get_param('adults'),
            'children' => $request->get_param('children'),
            'traveler_name' => $traveler_name,
            'email' => $email,
            'phone' => $phone,
            'country_of_residence' => $request->get_param('country_of_residence'),
            'occasion' => $request->get_param('occasion'),
            'message' => $request->get_param('message'),
            'status' => 'new',
            'source_url' => $request->get_param('source_url'),
        ]);

        return new WP_REST_Response(['success' => true, 'lead_id' => $lead_id, 'message' => 'Enquiry submitted successfully.'], 201);
    }

    public static function register_rest_fields(): void {
                // Expose featured content (including hero image) for home-settings page
                register_rest_field('page', 'hm_featured_content', [
                    'get_callback' => function ($post_arr) {
                        if (empty($post_arr['slug']) || $post_arr['slug'] !== 'home-settings') return null;
                        $settings = get_option('hm_featured_content_settings', []);
                        return [
                            'hero_image' => $settings['hero_image'] ?? '',
                            'hero_title' => $settings['hero_title'] ?? '',
                            'hero_subtitle' => $settings['hero_subtitle'] ?? '',
                            'cta1_label' => $settings['cta1_label'] ?? '',
                            'cta1_url' => $settings['cta1_url'] ?? '',
                            'cta2_label' => $settings['cta2_label'] ?? '',
                            'cta2_url' => $settings['cta2_url'] ?? '',
                        ];
                    },
                    'schema' => ['type' => 'object', 'context' => ['view', 'edit']],
                ]);
        foreach (['packages', 'destinations'] as $type) {
            register_rest_field($type, 'featured_image_url', [
                'get_callback' => function (array $post_arr) {
                    $image_id = get_post_thumbnail_id($post_arr['id']);
                    return $image_id ? wp_get_attachment_image_url($image_id, 'full') : null;
                },
                'schema' => ['type' => 'string', 'context' => ['view', 'edit']],
            ]);
        }

        register_rest_field('packages', 'hm_package_data', [
            'get_callback' => function (array $post_arr) {
                $post_id = (int) $post_arr['id'];
                return [
                    'package_id' => get_post_meta($post_id, 'package_id', true),
                    'destination_id' => (int) get_post_meta($post_id, 'destination_id', true),
                    'category' => get_post_meta($post_id, 'category', true),
                    'subtitle' => get_post_meta($post_id, 'subtitle', true),
                    'summary' => get_post_meta($post_id, 'summary', true),
                    'intro_content' => get_post_meta($post_id, 'intro_content', true),
                    'experience_content' => get_post_meta($post_id, 'experience_content', true),
                    'days' => (int) get_post_meta($post_id, 'days', true),
                    'nights' => (int) get_post_meta($post_id, 'nights', true),
                    'starting_price' => (float) get_post_meta($post_id, 'starting_price', true),
                    'currency' => get_post_meta($post_id, 'currency', true),
                    'pricing_basis' => get_post_meta($post_id, 'pricing_basis', true),
                    'rating' => (float) get_post_meta($post_id, 'rating', true),
                    'review_count' => (int) get_post_meta($post_id, 'review_count', true),
                    'pricing_tiers' => hm_get_array_meta($post_id, 'pricing_tiers'),
                    'inclusions' => hm_get_array_meta($post_id, 'inclusions'),
                    'exclusions' => hm_get_array_meta($post_id, 'exclusions'),
                    'departures' => hm_get_array_meta($post_id, 'departures'),
                    'itinerary' => hm_get_array_meta($post_id, 'itinerary'),
                    'seo_title' => get_post_meta($post_id, 'seo_title', true),
                    'meta_description' => get_post_meta($post_id, 'meta_description', true),
                    'canonical_url' => get_post_meta($post_id, 'canonical_url', true),
                ];
            },
            'schema' => ['type' => 'object', 'context' => ['view', 'edit']],
        ]);

        register_rest_field('destinations', 'hm_destination_data', [
            'get_callback' => function (array $post_arr) {
                $post_id = (int) $post_arr['id'];
                return [
                    'country' => get_post_meta($post_id, 'country', true),
                    'continent' => get_post_meta($post_id, 'continent', true),
                    'image' => get_post_meta($post_id, 'image', true),
                    'starting_price' => (float) get_post_meta($post_id, 'starting_price', true),
                    'subtitle' => get_post_meta($post_id, 'subtitle', true),
                    'intro_content' => get_post_meta($post_id, 'intro_content', true),
                    'best_time_to_visit' => get_post_meta($post_id, 'best_time_to_visit', true),
                    'seo_title' => get_post_meta($post_id, 'seo_title', true),
                    'meta_description' => get_post_meta($post_id, 'meta_description', true),
                    'canonical_url' => get_post_meta($post_id, 'canonical_url', true),
                    'highlights' => hm_get_array_meta($post_id, 'highlights'),
                ];
            },
            'schema' => ['type' => 'object', 'context' => ['view', 'edit']],
        ]);
    }

}

HM_REST::init();

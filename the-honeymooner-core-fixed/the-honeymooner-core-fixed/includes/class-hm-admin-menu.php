<?php
if (!defined('ABSPATH')) {
    exit;
}

class HM_Admin_Menu {
    public static function init(): void {
        add_action('admin_menu', [self::class, 'register_menu']);
    }

    public static function register_menu(): void {
        add_menu_page('Honeymooner', 'Honeymooner', 'edit_packages', 'hm_dashboard', [self::class, 'render_dashboard'], 'dashicons-heart', 26);
        add_submenu_page('hm_dashboard', 'Dashboard', 'Dashboard', 'edit_packages', 'hm_dashboard', [self::class, 'render_dashboard']);
        add_submenu_page('hm_dashboard', 'Destinations', 'Destinations', 'edit_destinations', 'edit.php?post_type=destinations');
        add_submenu_page('hm_dashboard', 'Packages', 'Packages', 'edit_packages', 'edit.php?post_type=packages');
        add_submenu_page('hm_dashboard', 'Themes', 'Themes', 'edit_packages', 'edit.php?post_type=themes');
        add_submenu_page('hm_dashboard', 'Leads', 'Leads', 'view_hm_leads', 'hm_leads', [HM_Leads_Admin::class, 'render_page']);
        add_submenu_page('hm_dashboard', 'Reviews', 'Reviews', 'view_hm_leads', 'hm_reviews', [HM_Reviews_Admin::class, 'render_page']);
        add_submenu_page('hm_dashboard', 'Sync Status', 'Sync Status', 'edit_packages', 'hm_sync_status', [HM_Sync_Admin::class, 'render_page']);
        add_submenu_page('hm_dashboard', 'Media Manager', 'Media Manager', 'edit_packages', 'hm_media_manager', [HM_Media_Admin::class, 'render_page']);
        add_submenu_page('hm_dashboard', 'Featured Content', 'Featured Content', 'edit_packages', 'hm_featured_content', [HM_Featured_Content_Admin::class, 'render_page']);
        add_submenu_page('hm_dashboard', 'Consultation', 'Consultation', 'manage_options', 'hm_consultation', [HM_Consultation_Admin::class, 'render_page']);
        add_submenu_page('hm_dashboard', 'Consultation Requests', 'Consultation Requests', 'manage_options', 'edit.php?post_type=consultation_request');
    }

    public static function render_dashboard(): void {
        global $wpdb;
        $leads = (int) $wpdb->get_var('SELECT COUNT(*) FROM ' . HM_Leads_DB::table_name());
        $reviews = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type = %s", 'package_review'));
        $packages = wp_count_posts('packages');
        $destinations = wp_count_posts('destinations');
        $themes = wp_count_posts('themes');
        ?>
        <div class="wrap hm-dashboard">
            <h1>The Honeymooner Dashboard</h1>
            <div class="hm-cards">
                <div class="hm-card"><h2>Destinations</h2><p><?php echo esc_html((string) ($destinations->publish ?? 0)); ?></p></div>
                <div class="hm-card"><h2>Packages</h2><p><?php echo esc_html((string) ($packages->publish ?? 0)); ?></p></div>
                <div class="hm-card"><h2>Themes</h2><p><?php echo esc_html((string) ($themes->publish ?? 0)); ?></p></div>
                <div class="hm-card"><h2>Leads</h2><p><?php echo esc_html((string) $leads); ?></p></div>
                <div class="hm-card"><h2>Reviews</h2><p><?php echo esc_html((string) $reviews); ?></p></div>
            </div>
        </div>
        <?php
    }
}



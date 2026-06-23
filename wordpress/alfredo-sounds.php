<?php
/**
 * Plugin Name: Alfredo Sounds
 * Description: Registers the alfredo_sound custom post type, sound_category taxonomy, and REST API endpoints for the Alfredo app.
 * Version:     1.0.0
 * Author:      Alfredo
 *
 * Requires: JWT Authentication for WP REST API plugin
 * Provides:
 *   GET    /wp-json/alfredo/v1/sounds
 *   POST   /wp-json/alfredo/v1/sounds              (requires auth)
 *   DELETE /wp-json/alfredo/v1/sounds/{id}          (requires auth)
 *   GET    /wp-json/alfredo/v1/sound-categories
 *   POST   /wp-json/alfredo/v1/sound-categories     (requires auth)
 *   DELETE /wp-json/alfredo/v1/sound-categories/{slug} (requires auth)
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// ─── Register custom post type & taxonomy ──────────────────────────────────

add_action( 'init', function () {

    register_post_type( 'alfredo_sound', [
        'labels'       => [
            'name'          => 'Sounds',
            'singular_name' => 'Sound',
        ],
        'public'       => false,
        'show_in_rest' => true,
        'supports'     => [ 'title', 'custom-fields' ],
    ] );

    register_taxonomy( 'sound_category', 'alfredo_sound', [
        'labels'       => [
            'name'          => 'Sound Categories',
            'singular_name' => 'Sound Category',
        ],
        'public'        => false,
        'show_in_rest'  => true,
        'hierarchical'  => false,
        'rewrite'       => false,
    ] );

} );

// ─── REST API routes ───────────────────────────────────────────────────────

add_action( 'rest_api_init', function () {

    register_rest_route( 'alfredo/v1', '/sounds', [
        [
            'methods'             => 'GET',
            'callback'            => 'alfredo_get_sounds',
            'permission_callback' => '__return_true',
        ],
        [
            'methods'             => 'POST',
            'callback'            => 'alfredo_create_sound',
            'permission_callback' => function () {
                return current_user_can( 'upload_files' );
            },
        ],
    ] );

    register_rest_route( 'alfredo/v1', '/sounds/(?P<id>\d+)', [
        [
            'methods'             => 'DELETE',
            'callback'            => 'alfredo_delete_sound',
            'permission_callback' => function () {
                return current_user_can( 'delete_posts' );
            },
        ],
    ] );

    register_rest_route( 'alfredo/v1', '/sound-categories', [
        [
            'methods'             => 'GET',
            'callback'            => 'alfredo_get_sound_categories',
            'permission_callback' => '__return_true',
        ],
        [
            'methods'             => 'POST',
            'callback'            => 'alfredo_create_sound_category',
            'permission_callback' => function () {
                return current_user_can( 'edit_posts' );
            },
        ],
    ] );

    register_rest_route( 'alfredo/v1', '/me', [
        [
            'methods'             => 'GET',
            'callback'            => 'alfredo_me',
            'permission_callback' => 'is_user_logged_in',
        ],
    ] );

    register_rest_route( 'alfredo/v1', '/sound-categories/(?P<slug>[a-z0-9-]+)', [
        [
            'methods'             => 'DELETE',
            'callback'            => 'alfredo_delete_sound_category',
            'permission_callback' => function () {
                return current_user_can( 'edit_posts' );
            },
        ],
    ] );

} );

// ─── Callbacks ─────────────────────────────────────────────────────────────

function alfredo_get_sounds() {
    $query = new WP_Query( [
        'post_type'      => 'alfredo_sound',
        'post_status'    => 'publish',
        'posts_per_page' => -1,
        'orderby'        => 'menu_order date',
        'order'          => 'ASC',
    ] );

    $sounds = [];
    foreach ( $query->posts as $post ) {
        $terms    = wp_get_post_terms( $post->ID, 'sound_category' );
        $category = ! is_wp_error( $terms ) && ! empty( $terms ) ? $terms[0] : null;

        $sounds[] = [
            'id'            => $post->ID,
            'title'         => $post->post_title,
            'file'          => get_post_meta( $post->ID, '_sound_file', true ),
            'iconName'      => get_post_meta( $post->ID, '_sound_icon', true ) ?: 'waves',
            'category'      => $category ? $category->slug : '',
            'categoryLabel' => $category ? $category->name : '',
        ];
    }

    return rest_ensure_response( $sounds );
}

function alfredo_create_sound( WP_REST_Request $request ) {
    $params = $request->get_json_params();

    if ( empty( $params['title'] ) || empty( $params['file'] ) ) {
        return new WP_Error( 'missing_fields', 'title and file are required.', [ 'status' => 400 ] );
    }

    $post_id = wp_insert_post( [
        'post_type'   => 'alfredo_sound',
        'post_title'  => sanitize_text_field( $params['title'] ),
        'post_status' => 'publish',
    ] );

    if ( is_wp_error( $post_id ) ) {
        return new WP_Error( 'insert_failed', 'Could not create sound post.', [ 'status' => 500 ] );
    }

    update_post_meta( $post_id, '_sound_file', esc_url_raw( $params['file'] ) );
    update_post_meta( $post_id, '_sound_icon', sanitize_text_field( $params['iconName'] ?? 'waves' ) );

    if ( ! empty( $params['category'] ) ) {
        wp_set_post_terms( $post_id, [ $params['category'] ], 'sound_category' );
    }

    return rest_ensure_response( [ 'id' => $post_id ], 201 );
}

function alfredo_get_sound_categories() {
    $terms = get_terms( [
        'taxonomy'   => 'sound_category',
        'hide_empty' => false,
        'orderby'    => 'name',
        'order'      => 'ASC',
    ] );

    if ( is_wp_error( $terms ) ) {
        return rest_ensure_response( [] );
    }

    $categories = array_map( function ( $term ) {
        return [
            'id'   => $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug,
        ];
    }, $terms );

    return rest_ensure_response( $categories );
}

function alfredo_create_sound_category( WP_REST_Request $request ) {
    $params = $request->get_json_params();
    $name   = sanitize_text_field( $params['name'] ?? '' );

    if ( empty( $name ) ) {
        return new WP_Error( 'missing_name', 'name is required.', [ 'status' => 400 ] );
    }

    $result = wp_insert_term( $name, 'sound_category' );

    if ( is_wp_error( $result ) ) {
        return new WP_Error( 'insert_failed', $result->get_error_message(), [ 'status' => 400 ] );
    }

    $term = get_term( $result['term_id'], 'sound_category' );

    return rest_ensure_response( [
        'id'   => $term->term_id,
        'name' => $term->name,
        'slug' => $term->slug,
    ] );
}

function alfredo_me() {
    $user    = wp_get_current_user();
    $isAdmin = in_array( 'administrator', (array) $user->roles, true );

    return rest_ensure_response( [
        'id'      => $user->ID,
        'isAdmin' => $isAdmin,
        'roles'   => (array) $user->roles,
    ] );
}

function alfredo_delete_sound( WP_REST_Request $request ) {
    $id   = (int) $request['id'];
    $post = get_post( $id );

    if ( ! $post || $post->post_type !== 'alfredo_sound' ) {
        return new WP_Error( 'not_found', 'Sound not found.', [ 'status' => 404 ] );
    }

    // Also delete the attached media file from the library
    $file_url    = get_post_meta( $id, '_sound_file', true );
    $attachment  = attachment_url_to_postid( $file_url );
    if ( $attachment ) {
        wp_delete_attachment( $attachment, true );
    }

    $result = wp_delete_post( $id, true );

    if ( ! $result ) {
        return new WP_Error( 'delete_failed', 'Could not delete sound.', [ 'status' => 500 ] );
    }

    return rest_ensure_response( [ 'deleted' => true, 'id' => $id ] );
}

function alfredo_delete_sound_category( WP_REST_Request $request ) {
    $slug = sanitize_title( $request['slug'] );
    $term = get_term_by( 'slug', $slug, 'sound_category' );

    if ( ! $term ) {
        return new WP_Error( 'not_found', 'Category not found.', [ 'status' => 404 ] );
    }

    $result = wp_delete_term( $term->term_id, 'sound_category' );

    if ( is_wp_error( $result ) ) {
        return new WP_Error( 'delete_failed', $result->get_error_message(), [ 'status' => 500 ] );
    }

    return rest_ensure_response( [ 'deleted' => true, 'slug' => $slug ] );
}

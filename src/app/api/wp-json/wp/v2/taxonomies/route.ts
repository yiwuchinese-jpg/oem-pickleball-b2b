import { NextResponse } from 'next/server';
import { getCorsHeaders } from '../utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const TAXONOMIES = {
  category: {
    name: 'Categories',
    slug: 'category',
    description: '',
    types: ['post'],
    hierarchical: true,
    rest_base: 'categories',
    visibility: { public: true, show_ui: true, show_in_menu: true, show_in_nav_menus: true, show_tagcloud: true },
    capabilities: { edit_terms: 'manage_categories', delete_terms: 'manage_categories', assign_terms: 'edit_posts' },
    labels: {
      name: 'Categories',
      singular_name: 'Category',
      search_items: 'Search Categories',
      all_items: 'All Categories',
      parent_item: 'Parent Category',
      parent_item_colon: 'Parent Category:',
      edit_item: 'Edit Category',
      view_item: 'View Category',
      update_item: 'Update Category',
      add_new_item: 'Add New Category',
      new_item_name: 'New Category Name',
      not_found: 'No categories found.',
    },
    _links: {
      collection: [{ href: `${SITE_URL}/wp-json/wp/v2/categories` }],
    },
  },
  post_tag: {
    name: 'Tags',
    slug: 'post_tag',
    description: '',
    types: ['post'],
    hierarchical: false,
    rest_base: 'tags',
    visibility: { public: true, show_ui: true, show_in_menu: true, show_in_nav_menus: true, show_tagcloud: true },
    capabilities: { edit_terms: 'manage_categories', delete_terms: 'manage_categories', assign_terms: 'edit_posts' },
    labels: {
      name: 'Tags',
      singular_name: 'Tag',
      search_items: 'Search Tags',
      all_items: 'All Tags',
      parent_item: null,
      parent_item_colon: null,
      edit_item: 'Edit Tag',
      view_item: 'View Tag',
      update_item: 'Update Tag',
      add_new_item: 'Add New Tag',
      new_item_name: 'New Tag Name',
      not_found: 'No tags found.',
    },
    _links: {
      collection: [{ href: `${SITE_URL}/wp-json/wp/v2/tags` }],
    },
  },
};

export async function OPTIONS() { return NextResponse.json({}, { headers: getCorsHeaders() }); }
export async function GET() { return NextResponse.json(TAXONOMIES, { headers: getCorsHeaders() }); }

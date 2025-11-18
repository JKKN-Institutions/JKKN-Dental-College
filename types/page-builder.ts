// =====================================================
// PAGE BUILDER TYPE DEFINITIONS
// =====================================================
// Purpose: Type definitions for page builder blocks and pages
// Module: page-builder
// Layer: Types
// =====================================================

// =====================================================
// BLOCK TYPES
// =====================================================

export type BlockType =
  // Content blocks
  | 'hero'
  | 'heading'
  | 'paragraph'
  | 'rich_text'
  | 'quote'
  | 'cta'
  // Media blocks
  | 'image'
  | 'gallery'
  | 'video'
  | 'carousel'
  // Layout blocks
  | 'two_column'
  | 'three_column'
  | 'card_grid'
  | 'accordion'
  | 'tabs'
  // Data blocks
  | 'table'
  | 'statistics'
  | 'timeline'
  | 'contact_form'
  | 'embed';

// =====================================================
// BASE INTERFACES
// =====================================================

export interface BaseBlockConfig {
  id: string;
  type: BlockType;
  order: number;
  visibility: 'visible' | 'hidden';
}

export interface CustomStyles {
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  maxWidth?: string;
}

// =====================================================
// CONTENT BLOCK TYPES
// =====================================================

export interface HeroBlockConfig extends BaseBlockConfig {
  type: 'hero';
  config: {
    title: string;
    subtitle?: string;
    backgroundType: 'image' | 'video' | 'gradient';
    backgroundImage?: string;
    backgroundVideo?: string;
    gradient?: {
      start: string;
      end: string;
    };
    ctaButtons?: Array<{
      label: string;
      href: string;
      variant: 'primary' | 'secondary';
    }>;
    overlay?: boolean;
    overlayOpacity?: number;
  };
  styles?: CustomStyles;
}

export interface HeadingBlockConfig extends BaseBlockConfig {
  type: 'heading';
  config: {
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
  };
  styles?: CustomStyles;
}

export interface ParagraphBlockConfig extends BaseBlockConfig {
  type: 'paragraph';
  config: {
    content: string;
    fontSize?: 'sm' | 'base' | 'lg' | 'xl';
  };
  styles?: CustomStyles;
}

export interface RichTextBlockConfig extends BaseBlockConfig {
  type: 'rich_text';
  config: {
    html: string;
  };
  styles?: CustomStyles;
}

export interface QuoteBlockConfig extends BaseBlockConfig {
  type: 'quote';
  config: {
    quote: string;
    author?: string;
    role?: string;
  };
  styles?: CustomStyles;
}

export interface CTABlockConfig extends BaseBlockConfig {
  type: 'cta';
  config: {
    heading: string;
    description?: string;
    buttons: Array<{
      label: string;
      href: string;
      variant: 'primary' | 'secondary';
    }>;
  };
  styles?: CustomStyles;
}

// =====================================================
// MEDIA BLOCK TYPES
// =====================================================

export interface ImageBlockConfig extends BaseBlockConfig {
  type: 'image';
  config: {
    src: string;
    alt: string;
    caption?: string;
    aspectRatio?: '16/9' | '4/3' | '1/1' | 'auto';
    objectFit?: 'cover' | 'contain' | 'fill';
  };
  styles?: CustomStyles;
}

export interface GalleryBlockConfig extends BaseBlockConfig {
  type: 'gallery';
  config: {
    images: Array<{
      src: string;
      alt: string;
      caption?: string;
    }>;
    columns: 2 | 3 | 4;
    gap?: number;
    lightbox?: boolean;
  };
  styles?: CustomStyles;
}

export interface VideoBlockConfig extends BaseBlockConfig {
  type: 'video';
  config: {
    videoType: 'youtube' | 'vimeo' | 'upload';
    videoUrl?: string;
    videoFile?: string;
    thumbnail?: string;
    autoplay?: boolean;
    controls?: boolean;
    loop?: boolean;
  };
  styles?: CustomStyles;
}

export interface CarouselBlockConfig extends BaseBlockConfig {
  type: 'carousel';
  config: {
    slides: Array<{
      image: string;
      title?: string;
      description?: string;
      link?: string;
    }>;
    autoplay?: boolean;
    interval?: number;
    showArrows?: boolean;
    showDots?: boolean;
  };
  styles?: CustomStyles;
}

// =====================================================
// LAYOUT BLOCK TYPES
// =====================================================

export interface TwoColumnBlockConfig extends BaseBlockConfig {
  type: 'two_column';
  config: {
    leftColumn: PageBlock[];
    rightColumn: PageBlock[];
    ratio?: '50/50' | '60/40' | '40/60' | '70/30' | '30/70';
    gap?: number;
    verticalAlign?: 'top' | 'center' | 'bottom';
    stackOnMobile?: boolean;
  };
  styles?: CustomStyles;
}

export interface ThreeColumnBlockConfig extends BaseBlockConfig {
  type: 'three_column';
  config: {
    leftColumn: PageBlock[];
    centerColumn: PageBlock[];
    rightColumn: PageBlock[];
    gap?: number;
    verticalAlign?: 'top' | 'center' | 'bottom';
    stackOnMobile?: boolean;
  };
  styles?: CustomStyles;
}

export interface CardGridBlockConfig extends BaseBlockConfig {
  type: 'card_grid';
  config: {
    cards: Array<{
      title: string;
      description: string;
      image?: string;
      link?: string;
      icon?: string;
    }>;
    columns: 2 | 3 | 4;
    cardStyle?: 'flat' | 'elevated' | 'outlined';
  };
  styles?: CustomStyles;
}

export interface AccordionBlockConfig extends BaseBlockConfig {
  type: 'accordion';
  config: {
    items: Array<{
      title: string;
      content: string;
    }>;
    allowMultiple?: boolean;
  };
  styles?: CustomStyles;
}

export interface TabsBlockConfig extends BaseBlockConfig {
  type: 'tabs';
  config: {
    tabs: Array<{
      label: string;
      content: PageBlock[];
    }>;
    defaultTab?: number;
  };
  styles?: CustomStyles;
}

// =====================================================
// DATA BLOCK TYPES
// =====================================================

export interface TableBlockConfig extends BaseBlockConfig {
  type: 'table';
  config: {
    headers: string[];
    rows: string[][];
    striped?: boolean;
    bordered?: boolean;
  };
  styles?: CustomStyles;
}

export interface StatisticsBlockConfig extends BaseBlockConfig {
  type: 'statistics';
  config: {
    stats: Array<{
      label: string;
      value: string | number;
      suffix?: string;
      icon?: string;
    }>;
    layout: 'horizontal' | 'grid';
    columns?: 2 | 3 | 4;
  };
  styles?: CustomStyles;
}

export interface TimelineBlockConfig extends BaseBlockConfig {
  type: 'timeline';
  config: {
    events: Array<{
      date: string;
      title: string;
      description: string;
    }>;
    orientation?: 'vertical' | 'horizontal';
  };
  styles?: CustomStyles;
}

export interface ContactFormBlockConfig extends BaseBlockConfig {
  type: 'contact_form';
  config: {
    title?: string;
    description?: string;
    fields: Array<{
      name: string;
      label: string;
      type: 'text' | 'email' | 'tel' | 'textarea';
      required: boolean;
      placeholder?: string;
    }>;
    submitButtonText?: string;
  };
  styles?: CustomStyles;
}

export interface EmbedBlockConfig extends BaseBlockConfig {
  type: 'embed';
  config: {
    embedType: 'iframe' | 'script';
    embedCode: string;
    aspectRatio?: '16/9' | '4/3' | '1/1';
  };
  styles?: CustomStyles;
}

// =====================================================
// UNION TYPE FOR ALL BLOCKS
// =====================================================

export type PageBlock =
  // Content blocks
  | HeroBlockConfig
  | HeadingBlockConfig
  | ParagraphBlockConfig
  | RichTextBlockConfig
  | QuoteBlockConfig
  | CTABlockConfig
  // Media blocks
  | ImageBlockConfig
  | GalleryBlockConfig
  | VideoBlockConfig
  | CarouselBlockConfig
  // Layout blocks
  | TwoColumnBlockConfig
  | ThreeColumnBlockConfig
  | CardGridBlockConfig
  | AccordionBlockConfig
  | TabsBlockConfig
  // Data blocks
  | TableBlockConfig
  | StatisticsBlockConfig
  | TimelineBlockConfig
  | ContactFormBlockConfig
  | EmbedBlockConfig;

// =====================================================
// PAGE INTERFACE
// =====================================================

export interface Page {
  id: string;
  title: string;
  slug: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  blocks: PageBlock[];
  published_blocks?: PageBlock[];
  seo_metadata?: {
    title?: string;
    description?: string;
    og_image?: string;
    keywords?: string[];
  };
  last_saved_at: string;
  last_auto_saved_at?: string;
  published_at?: string;
  published_by?: string;
  auto_added_to_nav: boolean;
  navigation_item_id?: string;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  version: number;
  // Joined data from queries
  creator?: {
    id: string;
    full_name?: string;
    email: string;
  };
  publisher?: {
    id: string;
    full_name?: string;
    email: string;
  };
}

// =====================================================
// DTO TYPES (Data Transfer Objects)
// =====================================================

export interface CreatePageDto {
  title: string;
  slug: string;
  description?: string;
  created_by: string;
}

export interface UpdatePageDto {
  id: string;
  title?: string;
  slug?: string;
  description?: string;
  blocks?: PageBlock[];
  seo_metadata?: Page['seo_metadata'];
  updated_by: string;
}

export interface PublishPageDto {
  id: string;
  user_id: string;
  add_to_navigation: boolean;
  navigation_config?: {
    parent_id?: string;
    label: string;
    position: 'first' | 'after' | 'last';
    after_item_id?: string;
  };
}

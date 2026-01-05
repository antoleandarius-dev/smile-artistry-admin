/**
 * Responsive Design Guidelines
 * MUI Breakpoint Strategy for Smile Artistry Admin
 * 
 * Breakpoints:
 * - xs: 0px (mobile phones)
 * - sm: 600px (landscape phones, small tablets)
 * - md: 900px (tablets)
 * - lg: 1200px (laptops)
 * - xl: 1536px (large desktops)
 */

export const BREAKPOINTS = {
  xs: 'xs', // 0px
  sm: 'sm', // 600px
  md: 'md', // 900px
  lg: 'lg', // 1200px
  xl: 'xl', // 1536px
};

/**
 * Spacing constants for responsive design
 */
export const RESPONSIVE_SPACING = {
  // Mobile-first spacing
  mobile: {
    padding: 1.5,
    gap: 1,
    margin: 1,
  },
  // Tablet spacing
  tablet: {
    padding: 2,
    gap: 1.5,
    margin: 1.5,
  },
  // Desktop spacing
  desktop: {
    padding: 3,
    gap: 2,
    margin: 2,
  },
};

/**
 * Common responsive sx patterns
 */
export const RESPONSIVE_PATTERNS = {
  /**
   * Responsive padding that increases with screen size
   */
  responsivePadding: {
    p: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
  },

  /**
   * Responsive gap for flex/grid layouts
   */
  responsiveGap: {
    gap: { xs: 1, sm: 1.5, md: 2 },
  },

  /**
   * Responsive font size for headings
   */
  responsiveHeading: {
    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.5rem' },
  },

  /**
   * Flex layout that stacks on mobile, row on desktop
   */
  responsiveFlex: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: { xs: 1, sm: 2 },
  },

  /**
   * Header layout with stacked action buttons on mobile
   */
  headerLayout: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', sm: 'center' },
    gap: { xs: 1.5, sm: 2 },
    mb: { xs: 2, sm: 3 },
  },

  /**
   * Button group - stack vertically on mobile
   */
  buttonGroup: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: { xs: 1, sm: 1.5 },
    width: { xs: '100%', sm: 'auto' },
    '& button': {
      width: { xs: '100%', sm: 'auto' },
    },
  },

  /**
   * Responsive grid for dashboard cards
   */
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(3, 1fr)',
      lg: 'repeat(4, 1fr)',
    },
    gap: { xs: 1.5, sm: 2, md: 2.5 },
  },

  /**
   * Table wrapper with horizontal scroll on mobile
   */
  tableWrapper: {
    overflowX: { xs: 'auto', md: 'visible' },
    '& table': {
      minWidth: { xs: 800, md: 'auto' },
    },
  },

  /**
   * Dialog fullscreen on mobile, normal on desktop
   */
  dialogResponsive: {
    '& .MuiDialog-paper': {
      width: { xs: '95%', sm: '90%', md: 'auto' },
      maxHeight: { xs: '95vh', md: '90vh' },
    },
  },

  /**
   * Touch target sizing (minimum 44x44px for mobile)
   */
  touchTarget: {
    minHeight: { xs: 44, md: 40 },
    minWidth: { xs: 44, md: 40 },
  },
};

/**
 * Drawer constants
 */
export const DRAWER_CONFIG = {
  widthDesktop: 240,
  widthTablet: 200,
  widthMobile: '75vw', // Takes 75% of viewport width
};

/**
 * Navigation constants
 */
export const NAVBAR_HEIGHT = 64; // MUI AppBar default height

/**
 * Helper function to get responsive drawer width
 */
export const getDrawerWidth = (breakpoint: string) => {
  switch (breakpoint) {
    case 'xs':
    case 'sm':
      return DRAWER_CONFIG.widthMobile;
    case 'md':
      return DRAWER_CONFIG.widthTablet;
    default:
      return DRAWER_CONFIG.widthDesktop;
  }
};

/**
 * Utility sx patterns for common responsive scenarios
 */
export const COMMON_PATTERNS = {
  /**
   * Hide element on mobile, show on tablet+
   */
  hideOnMobile: {
    display: { xs: 'none', sm: 'block' },
  },

  /**
   * Show element only on mobile
   */
  showOnlyMobile: {
    display: { xs: 'block', sm: 'none' },
  },

  /**
   * Full width on mobile, auto on desktop
   */
  fullWidthMobile: {
    width: { xs: '100%', sm: 'auto' },
  },

  /**
   * Responsive typography - larger on desktop
   */
  responsiveText: {
    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
  },

  /**
   * Responsive input field
   */
  responsiveInput: {
    width: '100%',
    '& .MuiInputBase-input': {
      fontSize: { xs: '16px', md: '14px' }, // Prevents zoom on iOS
    },
  },
};

/**
 * Touch-friendly spacing for interactive elements
 */
export const TOUCH_SPACING = {
  /**
   * Minimum touch target size (44px recommended for mobile)
   */
  minTouchSize: 44,

  /**
   * Spacing between touch targets
   */
  betweenTargets: { xs: 1, sm: 1.5, md: 2 },

  /**
   * Padding inside touch targets
   */
  insideTarget: { xs: 1, sm: 1.5 },
};

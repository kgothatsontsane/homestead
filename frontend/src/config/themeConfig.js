export const colors = {
  primary: '#4f46e5',
  primaryDark: '#4338ca',
  secondary: '#f43f5e',
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    600: '#4b5563',
    700: '#374151',
    900: '#111827'
  }
};

export const clerkAppearance = {
  elements: {
    formButtonPrimary: `!w-full !bg-[${colors.primary}] hover:!bg-[${colors.primaryDark}] !text-white !py-3 !rounded-lg !transition-colors`,
    buttonArrowIcon: "!text-white ml-2 w-4 h-4",
    formButtonText: "!text-white !font-medium",
    continueButton: `!bg-[${colors.primary}] hover:!bg-[${colors.primaryDark}] !text-white`,
    card: "bg-white/95 backdrop-blur-sm shadow-xl rounded-xl p-6 space-y-4",
    headerTitle: "text-2xl font-bold text-gray-900 text-center",
    headerSubtitle: "text-gray-600 text-center",
    rootBox: "mx-auto w-full max-w-md",
    // ...other common element styles
  },
  layout: {
    socialButtonsPlacement: "bottom"
  },
  variables: {
    primary: colors.primary,
    'primary-dark': colors.primaryDark
  }
};

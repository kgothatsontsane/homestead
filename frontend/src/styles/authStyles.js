export const authStyles = {
  input: `w-full p-4 bg-white border border-gray-200 rounded-lg 
    text-gray-900 placeholder:text-gray-500 
    focus:ring-2 focus:ring-primary focus:border-transparent
    shadow-sm`,
  
  button: `w-full py-3 px-4 bg-primary text-white rounded-md 
    hover:bg-primary/90 focus:outline-none focus:ring-2 
    focus:ring-offset-2 focus:ring-primary 
    disabled:opacity-50 transition-colors
    shadow-sm`,
  
  container: `min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-gray-50 to-white py-12 px-4`,
  
  formCard: `max-w-md w-full bg-white p-8 rounded-xl shadow-lg`,
  
  formTitle: `text-center text-3xl font-bold text-gray-900`,
  
  formSubtitle: `mt-2 text-center text-sm text-gray-600`,
  
  formWrapper: `mt-8 space-y-6`,
  
  inputGroup: `space-y-4`,
  
  captchaWrapper: `mt-4`,

  link: `text-primary hover:text-primary/80 font-medium`,
  
  divider: `border-t border-gray-200 my-6`,
  
  errorText: `text-red-600 text-sm mt-1`,
  
  helperText: `text-gray-500 text-sm mt-1`,

  logo: `w-16 h-16 mx-auto mb-4`,
  
  dividerWithText: `relative my-6 text-center before:content-[''] after:content-['']
    before:absolute before:w-1/3 before:h-px before:bg-gray-200 before:left-0 before:top-1/2
    after:absolute after:w-1/3 after:h-px after:bg-gray-200 after:right-0 after:top-1/2`,
  
  ssoButton: `w-full flex items-center justify-center gap-2 p-3 border border-gray-200
    rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium`,
  
  bottomLink: `mt-4 text-center text-sm text-gray-600`,
  
  ssoContainer: `space-y-3`,

  welcomeText: `text-lg text-gray-600 text-center mb-8
    font-['Inter',_sans-serif]`
};

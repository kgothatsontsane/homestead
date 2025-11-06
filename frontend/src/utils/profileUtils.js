export const checkProfileCompletion = (user) => {
  if (!user) return { isComplete: false, missing: ['all'] };

  const missing = [];
  
  if (!user.publicMetadata?.role) missing.push('role');
  if (!user.firstName || !user.lastName) missing.push('name');
  if (!user.publicMetadata?.phoneNumber) missing.push('contact');
  
  return {
    isComplete: missing.length === 0,
    missing
  };
};

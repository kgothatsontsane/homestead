import { SignUp } from "@clerk/clerk-react";
import AuthPageLayout from "../components/AuthPageLayout";
import { clerkAppearance } from "../config/themeConfig";

const SignUpPage = () => {
  return (
    <AuthPageLayout subtitle="Create your account">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        redirectUrl="/onboarding"
        appearance={{
          ...clerkAppearance,
          elements: {
            formButtonPrimary: "bg-secondary hover:bg-secondary/90",
            formFieldInput: "rounded-lg border-gray-300",
            card: "rounded-xl shadow-md",
          },
        }}
        afterSignUpUrl="/onboarding"
      />
    </AuthPageLayout>
  );
};

export default SignUpPage;

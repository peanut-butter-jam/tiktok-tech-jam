import { SignUpForm } from "./components/sign-up-form";

const SignUpPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;

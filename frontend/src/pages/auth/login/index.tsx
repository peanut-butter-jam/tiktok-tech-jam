import { LoginForm } from "./components/login-form";

const LoginPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <LoginForm />
    </div>
  );
};

export default LoginPage;

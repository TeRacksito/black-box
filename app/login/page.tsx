import BlackBox from "@/components/ui/black-box";
import LoginForm from "@/components/ui/login-form";

const Auth = () => {
  return (
    <div className="px-global mt-10 flex flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-2xl font-bold p-5 flex items-center justify-center gap-2">
        Inicia sesión en <BlackBox />
      </h1>
      <LoginForm />
    </div>
  );
};

export default Auth;

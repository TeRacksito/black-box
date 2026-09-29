import BlackBox from "@/components/ui/black-box";
import NewPasswordForm from "@/components/ui/new-password-form";

const NewPassword = () => {
  return (
    <div className="px-global mt-10 flex flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-2xl font-bold p-5 flex items-center justify-center gap-2">
        Cambia tu contraseña en <BlackBox />
      </h1>
      <NewPasswordForm />
    </div>
  );
};

export default NewPassword;

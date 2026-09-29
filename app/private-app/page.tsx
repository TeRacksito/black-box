const PrivateApp = () => {
  return (
    <main className="mt-10 px-global">
      <h1 className="flex items-center justify-center p-5 text-2xl font-bold">
        ¡Hola, esto es una app privada!
      </h1>
      <p className="p-2">
        Acabas de acceder a una aplicación web privada. Si, ¡existen!
      </p>
      <h2 className=" p-5 pl-0 mt-5 text-xl font-bold">
        ¿Puedo acceder a esta app?
      </h2>
      <p className="p-2">
        Depende, ¿tienes una cuenta de usuario? ¿no? Entonces{" "}
        <b>no puedes acceder</b> a esta app.
      </p>
      <h2 className=" p-5 pl-0 mt-5 text-xl font-bold">
        Entonces, ¿puedo crearme una cuenta de usuario?
      </h2>
      <p className="p-2">
        No. Las cuentas de usuario no crecen de los arboles. Es decir, o te la
        dan o nada monada.
      </p>
      <h2 className=" p-5 pl-0 mt-5 text-xl font-bold">
        ¿Quiere decir eso que solo puedo acceder si me invitan personalmente?
      </h2>
      <p className="p-2">
        ¡Exacto! Parece que sabes leer entre lineas. Solo los usuarios invitados
        pueden acceder a esta app.
      </p>
      <h2 className=" p-5 pl-0 mt-5 text-xl font-bold">
        ¿Y si de verdad quiero acceder a esta app privada?
      </h2>
      <p className="p-2">
        ¿Viste eso? A que está guapo como aparece ahí abajo. Bueno, pues ahi
        tienes al creador de esta app. Quizás le escribes y te deja entrar, pero
        vamos, probablemente no.
      </p>
    </main>
  );
};

export default PrivateApp;

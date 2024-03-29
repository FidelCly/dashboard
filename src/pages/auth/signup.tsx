import React, { useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { IUserAuthPayload } from '@/models/User';
import { useRouter } from 'next/router';
import { Label } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { errorCode } from '@/translation';

export default function signup() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserAuthPayload>({ mode: 'onChange' });

  const onSubmit: SubmitHandler<IUserAuthPayload> = useCallback(
    async (data) => {
      data.role = 'Fider';
      const endpoint = '/api/auth/signup';
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
      const toastid = toast.loading('Vérification en cours...');
      const response = await fetch(endpoint, options);
      const body = await response.json();
      if (response.status >= 400) {
        // read the response body
        toast.update(toastid, {
          render: `${
            errorCode[response.status][body.message] ||
            errorCode[response.status][body.error]
          }`,
          type: 'error',
          autoClose: 3000,
          isLoading: false,
        });
      } else {
        toast.update(toastid, {
          render: `${errorCode[response.status]['Account created']}`,
          type: 'success',
          autoClose: 3000,
          isLoading: false,
        });
        router.push('/auth/signin');
      }
    },
    [router],
  );

  return (
    <section className="relative z-10">
      <div className="flex flex-col items-center justify-center h-screen px-6 mx-auto gap-y-10 lg:py-0">
        <Image
          src="/logo.svg"
          width={400}
          height={100}
          alt="logo"
          className="lg:w-1/4 w-3/4"
        />
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div>
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                S'inscrire
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                Inscris-toi et commences à gérer ta boutique.
              </p>
            </div>
            <form
              className="flex flex-col space-y-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Label>Email</Label>
              <input
                {...register('email', {
                  required: "L'email est requis",
                  pattern: {
                    value:
                      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'Ce champ doit contenir un email valide',
                  },
                })}
                name="email"
                type="email"
                placeholder="hello@fidelcly.com"
                className="bg-fidbg border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-fidgreen focus:border-fidgreen block w-full p-2.5"
              />
              {errors.email && (
                <span className="text-red-600 text-sm">
                  {errors.email.message.toString()}
                </span>
              )}

              <Label>Mot de passe</Label>
              <input
                {...register('password', {
                  required: 'Le mot de passe est requis',
                  minLength: {
                    value: 8,
                    message:
                      'Le mot de passe doit contenir minimum 8 caractères',
                  },
                })}
                name="password"
                type="password"
                minLength={8}
                placeholder="********"
                className="bg-fidbg border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-fidgreen focus:border-fidgreen block w-full p-2.5"
              />
              {errors.password && (
                <span className="text-red-600 text-sm">
                  {errors.password.message.toString()}
                </span>
              )}

              <button
                type="submit"
                className="p-2 w-full m-auto text-gray-50 font-medium rounded-lg bg-fidgreen hover:bg-fidgreen/80"
              >
                S'inscrire
              </button>

              <p className="text-sm font-light text-gray-500 text-right">
                Déja inscrit ?{' '}
                <Link
                  href="/auth/signin"
                  className="font-medium text-gray-600 hover:text-fidgreen hover:underline"
                >
                  Se connecter
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

signup.getLayout = function getLayout(page) {
  return (
    <div className="relative bg-fidbg h-full min-h-screen">
      <div className="z-10">{page}</div>
      <div className="z-1 absolute h-fit w-full bottom-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#5DB075"
            fill-opacity="1"
            d="M0,160L80,165.3C160,171,320,181,480,208C640,235,800,277,960,282.7C1120,288,1280,256,1360,240L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>
      <div className="z-2 absolute h-fit w-full bottom-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#224957"
            fill-opacity="0.8"
            d="M0,192L60,213.3C120,235,240,277,360,277.3C480,277,600,235,720,202.7C840,171,960,149,1080,160C1200,171,1320,213,1380,234.7L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>{' '}
      </div>
    </div>
  );
};

import React, { useCallback, useEffect, useState } from 'react';
import type {
  IPromotionCreatePayload,
  IPromotionUpdatePayload,
  IPromotion,
} from '@/models/Promotions';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, Label } from 'flowbite-react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import moment from 'moment';
import { errorCode } from '@/translation';
// react fc with a promotion variable
export const PromotionCreateForm = ({
  promotions,
  setPromotions,
  setShown,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPromotionCreatePayload>({ mode: 'onChange' });

  const onSubmit: SubmitHandler<IPromotionCreatePayload> = useCallback(
    async (data) => {
      const toastid = toast.loading('Vérification en cours...');
      const isActive: boolean =
        new Date(data.startAt).toISOString() <= new Date().toISOString() &&
        new Date(data.endAt).toISOString() >= new Date().toISOString();

      const response = await fetch('/api/promotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          checkoutLimit: +data.checkoutLimit,
          isActive: isActive,
        }),
      });
      // read the response body
      const body = await response.json();
      if (response.status >= 400) {
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
          render: `${errorCode[response.status]['Promotion created']}`,
          type: 'success',
          autoClose: 3000,
          isLoading: false,
        });
        setPromotions([...promotions, body]);
        setShown(false);
      }
    },
    [],
  );
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-cy="promotion-form"
      className="flex flex-col gap-4 p-4 m-4 rounded-lg bg-fidbg"
    >
      <div className="">
        <Label htmlFor="name">Nom</Label>
        <input
          {...register('name', {
            required: 'Le nom de la promotion est requis',
            maxLength: {
              value: 50,
              message: 'Le nom ne doit pas dépasser 50 caractères',
            },
          })}
          type="text"
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-fidgreen focus:border-fidgreen block w-full p-2.5"
          id="name"
          maxLength={50}
          placeholder="Ma promotion"
        />
        {errors.name && (
          <span className="text-sm text-red-600">
            {errors.name.message.toString()}
          </span>
        )}
      </div>
      <div className="">
        <Label htmlFor="description">Description</Label>
        <input
          {...register('description', {
            required: 'La description est requise',
          })}
          type="text"
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-fidgreen focus:border-fidgreen block w-full p-2.5"
          id="description"
          placeholder="Réduction de 50% sur le deuxième produit acheté"
        />
        {errors.description && (
          <span className="text-sm text-red-600">
            {errors.description.message.toString()}
          </span>
        )}
      </div>
      <div className="flex justify-center space-x-4">
        <div className="flex-1">
          <Label htmlFor="startAt">Date de début</Label>
          <input
            {...register('startAt', {
              maxLength: {
                value: 50,
                message: 'La date de début ne doit pas dépasser 50 caractères',
              },
            })}
            type="date"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-fidgreen focus:border-fidgreen block w-full p-2.5"
            id="startAt"
            maxLength={50}
            placeholder={new Date().toDateString()}
          />
          {errors.startAt && (
            <span className="text-sm text-red-600">
              {errors.startAt.message.toString()}
            </span>
          )}
        </div>
        <div className="flex-1">
          <Label htmlFor="endAt">Date de fin</Label>
          <input
            {...register('endAt', {
              required: 'La date de fin est requise',
              maxLength: {
                value: 50,
                message: 'La date de fin ne doit pas dépasser 50 caractères',
              },
            })}
            type="date"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-fidgreen focus:border-fidgreen block w-full p-2.5"
            id="endAt"
            maxLength={50}
            placeholder="endAt"
          />
          {errors.endAt && (
            <span className="text-sm text-red-600">
              {errors.endAt.message.toString()}
            </span>
          )}
        </div>
      </div>
      <div className="">
        <Label htmlFor="checkoutLimit">Limite de passage</Label>
        <input
          {...register('checkoutLimit', {
            required: 'La limite de passage est requise',
            pattern: {
              value: /^\d*$/,
              message: 'La limite de passage doit être un nombre',
            },
            min: {
              value: 1,
              message: 'La limite de passage doit être supérieure à 0',
            },
          })}
          type="text"
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-fidgreen focus:border-fidgreen block w-full p-2.5"
          id="checkoutLimit"
          maxLength={50}
          min={1}
          placeholder="10"
        />
        {errors.checkoutLimit && (
          <span className="text-sm text-red-600">
            {errors.checkoutLimit.message.toString()}
          </span>
        )}
      </div>
      <Button
        className="text-gray-50 bg-fidgreen hover:bg-fidgreen/80"
        type="submit"
        data-cy="submit"
      >
        Enregistrer
      </Button>
    </form>
  );
};

export const PromotionUpdateForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IPromotionUpdatePayload>({ mode: 'onChange' });

  const [promotion, setPromotion] = useState<IPromotion>();
  const router = useRouter();
  const id = Number(router.query.id);

  const loadPromotion = async (): Promise<void> => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await fetch(`/api/promotions/${id}`, options);
      const data = await response.json();
      setPromotion(data);

      const startAt = moment(data.startAt).format('YYYY-MM-DD');
      const endAt = moment(data.endAt).format('YYYY-MM-DD');
      setValue('name', data.name);
      setValue('description', data.description);
      setValue('startAt', startAt);
      setValue('endAt', endAt);
      setValue('checkoutLimit', data.checkoutLimit);
      setValue('id', data.id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!id) return;
    loadPromotion();
  }, [id]);

  const onSubmit: SubmitHandler<IPromotionUpdatePayload> = useCallback(
    async (data) => {
      const id = toast.loading('Vérification en cours...');
      try {
        const isActive: boolean =
          new Date(data.startAt) <= new Date() &&
          new Date(data.endAt) >= new Date();

        const response = await fetch(`/api/promotions/${data.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            checkoutLimit: +data.checkoutLimit,
            isActive: isActive,
          }),
        });
        // read the response body
        const body = await response.json();
        if (response.status >= 400) {
          toast.update(id, {
            render: `${
              errorCode[response.status][body.message] ||
              errorCode[response.status][body.error]
            }`,
            type: 'error',
            autoClose: 3000,
            isLoading: false,
          });
        } else {
          // reload actual page
          router.push('/promotion');
          toast.update(id, {
            render: `${
              errorCode[response.status][body.message] ||
              errorCode[response.status][response.statusText]
            }`,
            type: 'success',
            autoClose: 3000,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    [promotion?.id],
  );
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 p-4 m-4 rounded-lg bg-fidbg font-normal"
    >
      <div className="">
        <Label htmlFor="name">Nom</Label>
        <input
          {...register('name', {
            required: 'Le nom de la promotion est requis',
            maxLength: {
              value: 50,
              message: 'Le nom ne doit pas dépasser 50 caractères',
            },
          })}
          type="text"
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-fidgreen focus:border-fidgreen block w-full p-2.5"
          id="name"
          maxLength={50}
          placeholder="Ma promotion"
        />
        {errors.name && (
          <span className="text-sm text-red-600">
            {errors.name.message.toString()}
          </span>
        )}
      </div>
      <div className="">
        <Label htmlFor="description">Description</Label>
        <input
          {...register('description', {
            required: 'La description est requise',
          })}
          type="text"
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-fidgreen focus:border-fidgreen block w-full p-2.5"
          id="description"
          placeholder="Réduction de 50% sur le deuxième produit acheté"
        />
        {errors.description && (
          <span className="text-sm text-red-600">
            {errors.description.message.toString()}
          </span>
        )}
      </div>
      <div className="flex justify-center space-x-4">
        <div className="flex-1">
          <Label htmlFor="startAt">Date de début</Label>
          <input
            {...register('startAt', {
              required: 'La date de début est requise',
              maxLength: {
                value: 50,
                message: 'La date de début ne doit pas dépasser 50 caractères',
              },
            })}
            type="date"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-fidgreen focus:border-fidgreen block w-full p-2.5"
            id="startAt"
            maxLength={50}
            placeholder={new Date().toDateString()}
          />
          {errors.startAt && (
            <span className="text-sm text-red-600">
              {errors.startAt.message.toString()}
            </span>
          )}
        </div>
        <div className="flex-1">
          <Label htmlFor="endAt">Date de fin</Label>
          <input
            {...register('endAt', {
              maxLength: {
                value: 50,
                message: 'La date de fin ne doit pas dépasser 50 caractères',
              },
            })}
            type="date"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-fidgreen focus:border-fidgreen block w-full p-2.5"
            id="endAt"
            maxLength={50}
            placeholder="endAt"
          />
          {errors.endAt && (
            <span className="text-sm text-red-600">
              {errors.endAt.message.toString()}
            </span>
          )}
        </div>
      </div>
      <div className="">
        <Label htmlFor="checkoutLimit">Limite de passage</Label>
        <input
          {...register('checkoutLimit', {
            required: 'La limite de passage est requise',
            min: {
              value: 1,
              message: 'La limite de passage doit être supérieure à 0',
            },
            pattern: {
              value: /^\d*$/,
              message: 'La limite de passage doit être un nombre',
            },
          })}
          type="text"
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-fidgreen focus:border-fidgreen block w-full p-2.5"
          id="checkoutLimit"
          maxLength={50}
          min={1}
          placeholder="10"
        />
        {errors.checkoutLimit && (
          <span className="text-sm text-red-600">
            {errors.checkoutLimit.message.toString()}
          </span>
        )}
      </div>
      <Button
        className="text-gray-50 bg-fidgreen hover:bg-fidgreen/80"
        type="submit"
        data-cy="submit"
      >
        Enregistrer
      </Button>
    </form>
  );
};

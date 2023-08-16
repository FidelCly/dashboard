import { Fragment, useEffect, useState } from 'react';
import { IPromotion } from '@/models/Promotions';
import { IUser } from '@/models/User';
import Link from 'next/link';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { errorCode } from '@/translation';

export default function PromotionList() {
  const [, setPromotions] = useState<IPromotion[]>([]);
  const [activePromotions, setActivePromotions] = useState<IPromotion[]>([]);
  const [inactivesPromotions, setInactivesPromotions] = useState<IPromotion[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const loadUser = async (): Promise<IUser> => {
    const userUuid = localStorage.getItem('userUuid');
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const user = fetch(`/api/user/${userUuid}`, options)
      .then((response) => response.json())
      .catch((error) => console.error(error));
    return user;
  };
  useEffect(() => {
    const loadPromotions = async (): Promise<void> => {
      setIsLoading(true);

      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const user = await loadUser();
      try {
        const response = await fetch(
          `/api/shop/${user.shop.id}/promotion`,
          options,
        );
        const data = await response.json();
        setPromotions(data);
        setActivePromotions(data.filter((p) => p.isActive));
        setInactivesPromotions(data.filter((p) => p.isActive === false));
      } catch (error) {
        console.error(error);
        setError(true);
      }

      setIsLoading(false);
    };
    loadPromotions();
  }, []);

  const deletePromotion = async (id: number): Promise<void> => {
    const toastid = toast.loading('Vérification en cours...');
    const response = await fetch(`/api/promotions/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const body = await response.json();
    if (response.status >= 400) {
      toast.update(toastid, {
        render: `${errorCode[response.status][body.message]}`,
        type: 'error',
        autoClose: 2000,
        isLoading: false,
      });
    } else {
      router.reload();
      toast.update(toastid, {
        render: `${errorCode[response.status][body.message]}`,
        type: 'success',
        autoClose: 2000,
        isLoading: false,
      });
    }
  };

  return (
    <div className="flow-root mt-8 rounded-lg bg-fidbg">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full">
            <thead className="bg-fidbg">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                >
                  Nom
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Limite de passage
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Date de début
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Date de fin
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                  <span className="sr-only">Edit</span>
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                  <span className="sr-only">Delete</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-fidbg">
              {isLoading && (
                <div>
                  <td
                    className="py-4 pl-4 pr-3 text-sm mx-auto justify-center font-medium text-gray-900 whitespace-nowrap sm:pl-3"
                    colSpan={7}
                  >
                    Chargement des promotions
                  </td>
                </div>
              )}
              {error && (
                <div>
                  <td
                    className="py-4 pl-4 pr-3 text-sm mx-auto justify-center font-medium text-gray-900 whitespace-nowrap sm:pl-3"
                    colSpan={7}
                  >
                    Error lors du chargement des promotions
                  </td>
                </div>
              )}
              {!error && (
                <>
                  {activePromotions.length > 0 && (
                    <Fragment key="Actives">
                      <tr className="border-t border-gray-200">
                        <th
                          colSpan={7}
                          scope="colgroup"
                          className="py-2 pl-4 pr-3 text-sm font-semibold text-left text-gray-900 bg-white sm:pl-3"
                        >
                          Actives
                        </th>
                      </tr>
                      {activePromotions.map((promotion) => (
                        <tr
                          key={promotion.id}
                          className="border-t border-gray-300"
                        >
                          <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                            {promotion.name}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {promotion.description}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {promotion.checkoutLimit}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {moment(promotion.startAt).format('DD/MM/YYYY')}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {moment(promotion.endAt).format('DD/MM/YYYY')}
                          </td>
                          <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-3">
                            <Link
                              href={`/promotion/${promotion.id}/edit`}
                              className="text-fidgreen hover:text-fidgreen/80 hover:underline"
                            >
                              Modifier
                              <span className="sr-only">{promotion.name}</span>
                            </Link>
                          </td>
                          <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-3">
                            <button
                              onClick={() => deletePromotion(promotion.id)}
                              className="text-fidgreen hover:text-fidgreen/80 hover:underline"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  )}
                  {inactivesPromotions.length > 0 && (
                    <Fragment key="Inactives">
                      <tr className="border-t border-gray-200">
                        <th
                          colSpan={7}
                          scope="colgroup"
                          className="py-2 pl-4 pr-3 text-sm font-semibold text-left text-gray-900 bg-white sm:pl-3"
                        >
                          Inactives
                        </th>
                      </tr>
                      {inactivesPromotions.map((promotion) => (
                        <tr
                          key={promotion.id}
                          className="border-t border-gray-300"
                        >
                          <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                            {promotion.name}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {promotion.description}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {promotion.checkoutLimit}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {promotion.startAt.toString()}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {promotion.endAt.toString()}
                          </td>
                          <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-3">
                            <Link
                              href={`/promotion/${promotion.id}/edit`}
                              className="text-fidgreen hover:text-fidgreen/80 hover:underline"
                            >
                              Modifier
                              <span className="sr-only">{promotion.name}</span>
                            </Link>
                          </td>
                          <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-3">
                            <Link
                              href={`/promotion/${promotion.id}/edit`}
                              className="text-fidgreen hover:text-fidgreen/80 hover:underline"
                            >
                              Supprimer
                              <span className="sr-only">{promotion.name}</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
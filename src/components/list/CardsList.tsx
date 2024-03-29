import { useEffect, useState } from 'react';
import { IUser } from '@/models/User';
import { errorCode } from '@/translation';
import { DateTime } from 'luxon';

function Skeleton() {
  return (
    <tr className="border-t border-gray-300">
      <td className="py-4 pl-4 pr-3 text-sm mx-auto justify-center font-medium text-gray-900 whitespace-nowrap sm:pl-3 w-1/4">
        <div className="animate-pulse flex space-x-4">
          <div className="h-2 bg-gray-200 rounded w-full"></div>
        </div>
      </td>
      <td className="py-4 pl-4 pr-3 text-sm mx-auto justify-center font-medium text-gray-900 whitespace-nowrap sm:pl-3 w-1/5">
        <div className="animate-pulse flex space-x-4 w-full">
          <div className="h-2 bg-gray-200 rounded w-full"></div>
        </div>
      </td>
      <td className="py-4 pl-4 pr-3 text-sm mx-auto justify-center font-medium text-gray-900 whitespace-nowrap sm:pl-3 w-1/5">
        <div className="animate-pulse flex space-x-4 w-full">
          <div className="h-2 bg-gray-200 rounded w-full"></div>
        </div>
      </td>
      <td className="py-4 pl-4 pr-3 text-sm mx-auto justify-center font-medium text-gray-900 whitespace-nowrap sm:pl-3 w-1/5">
        <div className="animate-pulse flex space-x-4 w-full">
          <div className="h-2 bg-gray-200 rounded w-full"></div>
        </div>
      </td>
      <td className="py-4 pl-4 pr-3 text-sm mx-auto justify-center font-medium text-gray-900 whitespace-nowrap sm:pl-3 w-1/5">
        <div className="animate-pulse flex space-x-4 w-full">
          <div className="h-2 bg-gray-200 rounded w-full"></div>
        </div>
      </td>
    </tr>
  );
}

export default function CardsList() {
  const [balances, setBalances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

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

  const loadCards = async (): Promise<void> => {
    setIsLoading(true);
    const user = await loadUser();

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await fetch(`/api/shop/${user.shop.id}/cards`, options);
      const data = await response.json();
      const list = [];
      data.forEach((c) => {
        c.balances.forEach((b) => {
          list.push({ ...b, username: c.user.username });
        });
      });

      list.sort((a, b) =>
        new Date(b.updatedAt).getTime() > new Date(a.updatedAt).getTime()
          ? 1
          : -1,
      );
      setBalances(list);
    } catch (error) {
      console.error(error);
      setError(true);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadCards();
  }, []);

  return (
    <>
      <div className="sm:flex-auto">
        <h1 className="text-xl font-semibold leading-6 text-gray-900">
          Activité récente
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Dernières activités de votre boutique.
        </p>
      </div>
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
                    Utilisateur
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Promotion
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Compteur
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Mise à jour le
                  </th>
                </tr>
              </thead>
              <tbody className="bg-fidbg">
                {isLoading && (
                  <>
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                  </>
                )}
                {!isLoading && error && (
                  <tr>
                    <td
                      className="py-4 pl-4 pr-3 text-sm mx-auto justify-center font-medium text-gray-900 whitespace-nowrap sm:pl-3"
                      colSpan={7}
                    >
                      Error lors du chargement de l'activité
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  !error &&
                  balances.map((balance) => (
                    <tr
                      key={balance.username + balance.updatedAt}
                      className="border-t border-gray-300"
                    >
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                        {balance.username}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {balance.promotion
                          ? balance.promotion.name
                          : 'Promotion supprimée'}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {balance.counter}
                      </td>
                      {balance.isActive === false ? (
                        <td className="whitespace-nowrap px-3 py-4">
                          <span className='className="whitespace-nowrap inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'>
                            {errorCode[200]['Promotion limit reached']}
                          </span>
                        </td>
                      ) : (
                        <td className="whitespace-nowrap px-3 py-4">
                          <span className="whitespace-nowrap inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                            {errorCode[200]['Balance updated']}
                          </span>
                        </td>
                      )}
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap capitalize">
                        {DateTime.fromISO(balance.updatedAt)
                          .setLocale('fr')
                          .toFormat('DDDD t')}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

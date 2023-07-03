import { useEffect, useState } from 'react';
import type { IShop } from '../../Models/Shop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Table } from 'flowbite-react';
import Link from 'next/link';

export default function ShopList() {
  const [shops, setShops] = useState<IShop[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadShops = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/shop`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json(); // Extract JSON data from response
        setShops(data); // Set state with extracted data
      } catch (error) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    void loadShops();
  }, []);

  if (isLoading) {
    return <div>loading....</div>;
  }

  if (error) {
    return (
      <div>
        <span>Erreur lors du chargement de shops</span>
      </div>
    );
  }

  function deleteshop(id: number): void {
    fetch(`/api/shop/${id}`, {
      method: 'DELETE',
    }).then((res) => {
      if (res.status >= 400) {
        throw new Error('Bad response from server');
      }
      return res.json();
    });
  }

  return (
    <main className="p-4">
      <Table striped className="table w-full ">
        <Table.Head>
          <Table.HeadCell>Company Name</Table.HeadCell>
          <Table.HeadCell>Address</Table.HeadCell>
          <Table.HeadCell>Zip Code</Table.HeadCell>
          <Table.HeadCell>Phone</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {shops.map((shop) => (
            <Table.Row
              className=" dark:border-gray-700 dark:bg-gray-800"
              key={shop.id}
            >
              <Table.Cell>{shop.companyName}</Table.Cell>
              <Table.Cell>{shop.address}</Table.Cell>
              <Table.Cell>{shop.zipCode}</Table.Cell>
              <Table.Cell>{shop.phone}</Table.Cell>
              <Table.Cell>{shop.email}</Table.Cell>
              <Table.Cell className="space-x-2">
                <Link href={{ pathname: `/shops/${shop.id}` }}>
                  <FontAwesomeIcon icon={faEdit} />
                </Link>
                <button onClick={() => deleteshop(shop.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </main>
  );
}

import {
  faBarcode,
  faChartPie,
  faEnvelope,
  faGear,
  faRectangleAd,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import Image from 'next/image';

export default function Sidebar() {
  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-green-300 ">
        <p className="flex items-center pl-2.5 mb-5 space-x-4">
          <Image
            src="/logo.png"
            width={60}
            height={40}
            className="rounded"
            alt="logo"
          />
          <span className="self-center flex-1 text-xl font-semibold whitespace-nowrap ">
            Fidecly
          </span>
        </p>
        <ul className="flex flex-col space-y-2 font-bold">
          <li>
            <Link
              href="/"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faChartPie} />
              <span className="ml-3">Tableau de bord</span>
            </Link>
          </li>
          <li>
            <Link
              href="/scanner"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 "
            >
              <FontAwesomeIcon icon={faBarcode} />
              <span className="flex-1 ml-3 whitespace-nowrap">Scanner</span>
            </Link>
          </li>
          <li>
            <Link
              href="/campagne"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 "
            >
              <FontAwesomeIcon icon={faEnvelope} />
              <span className="flex-1 ml-3 whitespace-nowrap">
                Campagnes emails
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/promotion"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 "
            >
              <FontAwesomeIcon icon={faRectangleAd} />
              <span className="flex-1 ml-3 whitespace-nowrap">Promotions</span>
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 "
            >
              <FontAwesomeIcon icon={faGear} />
              <span className="flex-1 ml-3 whitespace-nowrap">Réglages</span>
            </Link>
          </li>
          <li>
            <div className="flex items-center p-2 text-gray-900 rounded-lg "></div>
          </li>
        </ul>
      </div>
    </aside>
  );
}
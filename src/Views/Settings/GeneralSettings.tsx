import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileForm from "../../Components/form/ProfileForm";
import { useState } from "react";
import Cardform from "../../Components/form/CardForm";
export default function GeneralSettings() {
  const [Profile, setProfile] = useState(false);
  const [Card, setCard] = useState(false);
  const handleClick = (envent) => {
    setProfile((current) => !current);
  };
  const handleClick2 = (envent) => {
    setCard((current) => !current);
  };
  return (
    <div className="container max-w-6xl mx-auto mt-4">
      <div className="flex">
        <h1 className="flex-1 text-4xl">GeneralSettings</h1>
        <button
          type="button"
          onClick={handleClick}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <FontAwesomeIcon icon={faPlusSquare} />
          Edit profile
        </button>
        <button
          type="button"
          onClick={handleClick2}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <FontAwesomeIcon icon={faPlusSquare} />
          Edit card
        </button>
      </div>
      {Profile && (
        <div>
          <h1>Edit profile</h1>
          <ProfileForm />
        </div>
      )}
      {Card && (
        <div>
          <h1>Edit card</h1>
          <Cardform />
        </div>
      )}
    </div>
  );
}

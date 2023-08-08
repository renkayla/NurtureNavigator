import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { API_RESULTS } from "../../utils/queries";

const Search = () => {
  const [plant, setPlant] = useState('');
  const [searchedPlant, setSearchedPlant] = useState(null); // Store the searched result

  const { loading, error, data: plants } = useQuery(API_RESULTS);

  console.log(plants);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (plants && plants.api && plants.api.data) {
      const foundPlant = plants.api.data.find(p => p.common_name.toLowerCase() === plant.toLowerCase());
      setSearchedPlant(foundPlant);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 pt-20 pb-40 mb-26 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Search Plants
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleFormSubmit} method="POST">
          <div>
            <label htmlFor="plant" className="block text-sm font-medium leading-6 text-gray-900">
                Enter the name of a plant
            </label>
            <div className="mt-2">
                <input
                type="text"
                name="plant"
                id="plant"
                onChange={(e) => setPlant(e.target.value)}
                value={plant}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
            </div>
          </div>

            <div>
              <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-green-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                  Search
              </button>
            </div>
          </form>
      </div>
          {/* Display search result */}
        {searchedPlant && (
          <div className="mt-10 p-5 border border-gray-200 rounded-md shadow-md bg-white">
              <h3 className="text-xl font-semibold mb-4 text-green-700">{searchedPlant.common_name}</h3>
              <div className="mb-4">
                  <img className="max-w-full h-auto rounded-md shadow" src={searchedPlant.default_image.medium_url} alt={searchedPlant.common_name} />
              </div>
              <p className="mb-2 text-gray-700">
                  <strong className="text-gray-900">Scientific Name:</strong> {searchedPlant.scientific_name[0]}
              </p>
              {searchedPlant.other_name.length > 0 && (
                  <p className="text-gray-700">
                      <strong className="text-gray-900">Other Names:</strong> {searchedPlant.other_name.join(', ')}
                  </p>
              )}
          </div>

      )}

    </div>
  )

}

export default Search;

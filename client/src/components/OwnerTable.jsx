import React, { useEffect, useState } from 'react';
import { Owners_table } from './antDesignUI/TableUi';
import { getCreatedData } from '../utils/Roomutils';
function OwnerTable({ apartmentNames }) {
  const [ownersData, setOwnersData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      const data = apartmentNames.map((apartment, index) => ({
        flat_id: apartment.flat_id,
        apt_name: apartment.apartment_name,
        created_at: getCreatedData(apartment.createdAt), // Replace with real date or fetched data
        registration_num: apartment.registration_num,
        emergency_email: apartment.emergency_email,
        no_of_residents: apartment.resident_id.length,
        address: apartment.address, //
        pincode: apartment.pincode,
      }));
      setOwnersData(data);
    };

    fetchData();
  }, [apartmentNames]); // Dependencies for when to re-run useEffect

  // Render the Owners_table component with the fetched or provided data
  return <Owners_table data={ownersData} />;
}

export default OwnerTable;

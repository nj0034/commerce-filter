import React, {useEffect, useState} from 'react';
import {API_URL} from "../pages";
import Link from "next/link";
import axios from "axios";
import {useRouter} from "next/router";

interface Brand {
    name: string;
}

const Brands = () => {
  const router = useRouter();
  const {brand: selectedBrand} = router.query;

  const [brands, setBrands] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/brands`)
      .then((res) => {
        setBrands(res.data);
      })
  }, [])

  return (
    <div>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
      }}>
        {brands?.map(({name}: Brand) => (
          <Link
            href={{
              // pathname: `/${name}`,
              query: {
                ...router.query,
                brand: name
              }
            }}
            key={name}
          >
            <div
              style={{
                margin: '10px',
                fontWeight: selectedBrand === name ? 'bold' : 'normal',
              }}
            >
              <span>{name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Brands;
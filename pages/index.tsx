import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Brands from "../components/brands";
import RightFilters from "../components/rightFilters";
import Products from "../components/products";
import {useRouter} from "next/router";
import Link from "next/link";

export const API_URL = 'https://lz5cdtbtci.execute-api.ap-northeast-2.amazonaws.com/assignment';

const Home: NextPage = () => {
  const router = useRouter();
  const {brand, color} = router.query;
  return (
    <div className={styles.container}>
      <Link href={'/'}>
        <h2>HOME</h2>
      </Link>

      <Brands/>

      <div style={{display: 'flex'}}>
        <div style={{flex: 1, marginRight: '20px'}}>
          <Products/>
        </div>
        <div>
          <RightFilters/>
        </div>
      </div>
    </div>
  );
}

export default Home

import {useEffect, useMemo, useState} from "react";
import {API_URL} from "../pages";
import axios from "axios";
import {useRouter} from "next/router";
import Image from "next/image";
import {useRanger} from 'react-ranger';

interface Product {
  id: number; //상품 고유번호
  name: string; //상품명
  image: string; //상품 이미지 url
  category_id: number; //카테고리 번호
  brand: string; //브랜드명
  color: string; //색상명 ex) 'black'
  original_price: number; //정가
  sales_price: number; //판매가
  retailer_id: number;
}

const Products = () => {
  const router = useRouter();
  const {brand, color, categoryId} = router.query;

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const lastPage = useMemo(() => Math.max(Math.ceil(total / 20), 1), [total]);

  const goToNextPage = () => {
    if (page < lastPage) {
      setPage(page + 1);
    }
  };

  const goToPrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const INITIAL_MIN_PRICE = 0;
  const INITIAL_MAX_PRICE = 10000000;
  const PRICE_MIN_INTERVAL = 100000;

  const [minPrice, setMinPrice] = useState(INITIAL_MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(INITIAL_MAX_PRICE);

  useEffect(() => {
    axios.get(`${API_URL}/products`, {
      params: {
        brand,
        color,
        categoryId,
        page,
        minPrice,
        maxPrice,
      }
    })
      .then((res) => {
        setProducts(res.data.products);
        setTotal(res.data.total);
      })

  }, [
    brand, color, categoryId, page,
    minPrice, maxPrice
  ]);

  useEffect(() => {
    setPage(1);
  }, [brand, color, categoryId]);

  const [prices, setPrices] = useState([INITIAL_MIN_PRICE, INITIAL_MAX_PRICE]);

  const onDrag = (values) => {
    if (activeHandleIndex === 0 && values[0] + PRICE_MIN_INTERVAL > values[1]) {
      setPrices([values[1] - PRICE_MIN_INTERVAL, values[1]]);
    } else if (activeHandleIndex === 1 && values[1] - PRICE_MIN_INTERVAL < values[0]) {
      setPrices([values[0], values[0] + PRICE_MIN_INTERVAL]);
    } else {
      setPrices(values);
    }
  }

  const onChange = (values: number[]) => {
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
  }

  const initializePrices = () => {
    setPrices([INITIAL_MIN_PRICE, INITIAL_MAX_PRICE]);
    setMinPrice(INITIAL_MIN_PRICE);
    setMaxPrice(INITIAL_MAX_PRICE);
  }

  const {getTrackProps, handles, activeHandleIndex} = useRanger({
    min: INITIAL_MIN_PRICE,
    max: INITIAL_MAX_PRICE,
    stepSize: 100,
    values: prices,
    onDrag: onDrag,
    onChange: onChange,
  });

  return (
    <div style={{width: '100%'}}>
      <div style={{border: '1px solid lightgray', padding: '20px'}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <h3>가격 필터</h3>
          <button onClick={initializePrices} style={{margin: '0 10px'}}>초기화</button>
        </div>
        <div
          {...getTrackProps({
            style: {
              height: "4px",
              background: "#ddd",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,.6)",
              borderRadius: "2px",
            }
          })}
        >
          {handles.map(({getHandleProps}) => (
            <button
              {...getHandleProps({
                style: {
                  width: "14px",
                  height: "14px",
                  outline: "none",
                  borderRadius: "100%",
                  background: "linear-gradient(to bottom, #eee 45%, #ddd 55%)",
                  border: "solid 1px #888"
                }
              })}
            />
          ))}
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', margin: '20px'}}>
          <div>최저 금액 : {prices[0].toLocaleString()}</div>
          <div>최고 금액 : {prices[1].toLocaleString()}</div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
        }}
      >
        {products.map((product: Product) => {
          const discountPercent = Math.floor((1 - product.sales_price / product.original_price) * 100);
          return (
            <div key={product.id}
                 style={{
                   width: '20%',
                   border: '1px solid lightgray',
                   padding: '20px',
                   display: 'flex',
                   flexDirection: 'column',
                 }}
            >
              <img
                src={product.image} alt={product.name}
                width={'100%'}
                // height={'100%'}
              />
              <span>{product.brand}</span>
              <span>{product.name}</span>
              <span>{product.sales_price.toLocaleString()}원</span>
              <span>{discountPercent > 0 && `${discountPercent}%`}</span>

            </div>
          )
        })}
      </div>

      <div style={{display: 'flex', justifyContent: 'center', margin: '20px'}}>
        <button onClick={() => setPage(1)}>{'<<'}</button>
        <button onClick={goToPrevPage}>Prev</button>
        <span style={{margin: '0 20px'}}>{page} / {lastPage}</span>
        <button onClick={goToNextPage}>Next</button>
        <button onClick={() => setPage(lastPage)}>{'>>'}</button>
      </div>

    </div>
  )
}
export default Products;
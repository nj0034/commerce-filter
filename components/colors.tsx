import {useEffect, useState} from "react";
import axios from "axios";
import {API_URL} from "../pages";
import Link from "next/link";
import {useRouter} from "next/router";

interface Color {
    name: string;
}

const Colors = () => {
  const ALL_COLORS = 'ALL COLORS';
  const router = useRouter();
  const {brand, color: selectedColor} = router.query;

  const [isVisible, setIsVisible] = useState(true);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/colors`,)
      .then((res) => {
        setColors(res.data);
      })
  }, []);

  const toggleVisible = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <span onClick={toggleVisible}>
        <span style={{fontWeight: 'bold'}}>Colors</span>
        <span style={{}}> {isVisible ? '▼' : '▲'}</span>
      </span>

      <div style={{display: isVisible ? 'flex' : 'none'}}>
        <ul>
          {[{name: ALL_COLORS}, ...colors].map((color: Color) => {
            const isSelected = (selectedColor === color.name) || (!selectedColor && color.name === ALL_COLORS);
            return (<Link
              href={{
                // pathname: `/${brand}`,
                query: {
                  ...router.query,
                  color: color.name === ALL_COLORS ? '' : color.name,
                }
              }}
              key={color.name}
            >
              <li>
              <span style={{
                fontWeight: isSelected ? 'bold' : 'normal',
              }}>{color.name}</span>
              </li>
            </Link>)
          })}
        </ul>
      </div>

    </div>
  )
}

export default Colors;
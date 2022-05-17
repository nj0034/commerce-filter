import {useEffect, useState} from "react";
import axios from "axios";
import {API_URL} from "../pages";
import Link from "next/link";
import {useRouter} from "next/router";

interface Category {
  id: number; //해당 카테고리의 id입니다.
  parent_id: number; //상위 카테고리의 id입니다. null인 경우 root 카테고리입니다.
  name: string; //카테고리명입니다.
}

interface ParentCategory {
  id: number;
  name: string;
  children: Category[];
  isVisible: boolean;
}

const CategoryItem = ({category, isSelected}: { category: Category | ParentCategory, isSelected: Boolean }) => {
  const router = useRouter();
  return (
    <Link
      href={{
        // pathname: `/${brand}`,
        query: {
          ...router.query,
          categoryId: category.id ? category.id : null,
        }
      }}
      key={category.id}
    >
      <li key={category.id}>
        <span
          style={{
            fontWeight: isSelected ? 'bold' : 'normal',
          }}
        >{category.name}</span>
      </li>
    </Link>
  )
}

const Categories = () => {
  const router = useRouter();
  const {brand, color, categoryId: selectedCategoryId} = router.query;

  const [isVisible, setIsVisible] = useState(true);
  const [categories, setCategories] = useState([]);

  const [sortedCategories, setSortedCategories] = useState({});
  const [visibleChildrenCategoryId, setVisibleChildrenCategoryId] = useState(selectedCategoryId);

  useEffect(() => {
    axios.get(`${API_URL}/categories`,)
      .then((res) => {
        setCategories(res.data);
      })
  }, []);

  useEffect(() => {
    categories.forEach((category: Category) => {
      if (category.parent_id === null) {
        setSortedCategories(prevState => ({
          ...prevState,
          [category.id]: {
            id: category.id,
            name: category.name,
            children: [],
            isVisible: false,
          }
        }));
      } else {
        setSortedCategories(prevState => ({
          ...prevState,
          [category.parent_id]: {
            ...prevState[category.parent_id],
            children: [
              ...prevState[category.parent_id].children,
              category,
            ]
          }
        }));
      }
    });

  }, [categories])

  const toggleAllCategoriesVisible = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <span onClick={toggleAllCategoriesVisible}>
        <span style={{fontWeight: 'bold'}}>Categories</span>
        <span style={{}}> {isVisible ? '▼' : '▲'}</span>
      </span>

      <div style={{display: isVisible ? 'flex' : 'none'}}>
        <ul>
          <CategoryItem
            category={{id: '', parent_id: null, name: 'All CATEGORIES'}}
            isSelected={!selectedCategoryId}
          />
          {Object.entries(sortedCategories).map(([parentCategoryId, parentCategory]) => (
            <div key={parentCategory.id}>
              <div onClick={() => setVisibleChildrenCategoryId(parentCategory.id)}>
                <CategoryItem
                  category={parentCategory}
                  isSelected={selectedCategoryId === parentCategory.id.toString()}
                />
              </div>
              <ul style={{display: visibleChildrenCategoryId === parentCategory.id ? 'block' : 'none'}}>
                {parentCategory.children.map((category: Category) => (
                  <CategoryItem
                    key={category.id}
                    category={category}
                    isSelected={selectedCategoryId === category.id.toString()}
                  />
                ))}
              </ul>
            </div>

          ))}
        </ul>
      </div>

    </div>
  )
}

export default Categories;
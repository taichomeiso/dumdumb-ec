import { PRODUCT_CATEGORIES } from "@/constants";

type CategoryNavProps = {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

export const CategoryNav = ({ selectedCategory, onSelectCategory }: CategoryNavProps) => {
  return (
    <nav className="max-w-6xl mx-auto px-4 my-16">
      <ul className="flex gap-4 overflow-x-auto pb-4 justify-center">
        {PRODUCT_CATEGORIES.map((category) => (
          <li key={category}>
            <button
              onClick={() => onSelectCategory(category)}
              className={`px-6 py-2 rounded-full border-2 border-black text-black transition-all duration-300 font-bold tracking-wide
                ${selectedCategory === category ? 'bg-black text-white' : 'hover:bg-black hover:text-white'}`}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
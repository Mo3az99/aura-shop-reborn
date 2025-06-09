
interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

interface CategorySectionProps {
  categories: Category[];
}

const CategorySection = ({ categories }: CategorySectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {categories.map((category) => (
        <div
          key={category.id}
          className="group relative overflow-hidden cursor-pointer"
        >
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={category.image_url || '/placeholder.svg'}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <h3 className="text-2xl font-light mb-2 tracking-wide">{category.name.toUpperCase()}</h3>
            <p className="text-sm opacity-90">{category.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategorySection;

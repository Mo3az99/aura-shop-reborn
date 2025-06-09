
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div
          key={category.id}
          className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
        >
          <div className="aspect-square">
            <img
              src={category.image_url || '/placeholder.svg'}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
            <p className="text-gray-200 text-sm">{category.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategorySection;

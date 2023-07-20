import { useCategories } from "@/hooks/useCategories";

function TrendingCategories() {
  const { data: categories, isLoading: isCategoriesLoading } = useCategories({ order: "trending" });

  return (
    <div>
      <h3 className="font-semibold text-xl mt-4">Check out trending categories</h3>

      <div className="grid grid-cols-4 gap-4 mt-3">
        {!isCategoriesLoading &&
          categories &&
          categories.slice(0, 8).map((category) => {
            return (
              <div
                key={category.id}
                role="button"
                className="px-4 py-4 text-sm bg-base-200 flex gap-4 shadow-md"
              >
                <span>{category.name}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
export default TrendingCategories;

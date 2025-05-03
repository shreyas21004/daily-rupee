
export type ExpenseCategory = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export const categories: ExpenseCategory[] = [
  {
    id: "food",
    name: "Food & Dining",
    color: "bg-red-500",
    icon: "🍔",
  },
  {
    id: "transport",
    name: "Transportation",
    color: "bg-blue-500",
    icon: "🚗",
  },
  {
    id: "utilities",
    name: "Utilities",
    color: "bg-yellow-500",
    icon: "💡",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    color: "bg-purple-500",
    icon: "🎬",
  },
  {
    id: "shopping",
    name: "Shopping",
    color: "bg-pink-500",
    icon: "🛍️",
  },
  {
    id: "health",
    name: "Health & Medical",
    color: "bg-green-500",
    icon: "🏥",
  },
  {
    id: "other",
    name: "Other",
    color: "bg-gray-500",
    icon: "📝",
  },
];

export const getCategoryById = (id: string): ExpenseCategory => {
  return categories.find(category => category.id === id) || categories[categories.length - 1];
};

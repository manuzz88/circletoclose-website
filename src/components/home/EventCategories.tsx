import React from 'react';
import Link from 'next/link';

type CategoryType = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
};

type EventCategoriesProps = {
  categories: CategoryType[];
};

export default function EventCategories({ categories }: EventCategoriesProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">I Nostri Eventi</h2>
        
        <div className="grid grid-cols-1 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/eventi`}
              className="group"
            >
              <div 
                className="aspect-video rounded-lg flex flex-col items-center justify-center p-10 transition-all duration-300 group-hover:shadow-xl"
                style={{ backgroundColor: category.color || '#f3f4f6' }}
              >
                <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center mb-6 shadow-md">
                  <span className="text-4xl" aria-hidden="true">{category.icon}</span>
                </div>
                <h3 className="text-2xl font-semibold text-center mb-2">{category.name}</h3>
                <p className="text-lg text-center mt-2 opacity-80 max-w-2xl">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
